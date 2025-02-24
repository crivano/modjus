export const calculateAge = (birthday: string): string => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    return years === 0
        ? `${months} ${months === 1 ? 'mês' : 'meses'}`
        : `${years} ${years === 1 ? 'ano' : 'anos'}`;
}

/**
 * Converte uma idade definida como string ("0 meses", "1 mês", "1 ano", "2 anos")
 * para meses.
 */
function parseAge(ageStr: string): number {
    const match = ageStr.match(/^\s*(-?\d+)\s*(mês|meses|anos?)\s*$/i);
    if (!match) {
        // return undefined
        throw new Error(`Formato de idade inválido: ${ageStr}`);
    }
    let value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    if (unit.startsWith("ano")) {
        value *= 12;
    }
    return value;
}

/**
 * Converte uma condição de restrição ("< 1 ano", "> 6 meses", etc)
 * para um objeto contendo o operador e o valor em meses.
 * Se a condição não especificar a unidade, usa defaultUnit se fornecido.
 */
function parseCondition(condStr: string, defaultUnit?: string): { operator: string; value: number } {
    const match = condStr.match(/^\s*([<>])\s*(\d+)(?:\s*(mês|meses|anos?))?\s*$/i);
    if (!match) {
        throw new Error(`Formato de restrição inválido: ${condStr}`);
    }
    const operator = match[1];
    let num = parseInt(match[2], 10);
    let unit = match[3] ? match[3].toLowerCase() : defaultUnit;
    if (!unit) {
        throw new Error(`Unidade ausente na restrição: ${condStr}`);
    }
    if (unit.startsWith("ano")) {
        num *= 12;
    }
    return { operator, value: num };
}

/**
 * Verifica se a idade corresponde à restrição.
 * A idade pode ser "0 meses", "1 mês", "1 ano", "2 anos", etc.
 * A restrição pode ser:
 *   "> 6 meses", "< 1 ano", "> 7 e < 16 anos", "> 6 meses e < 2 anos"
 */
export function isAgeValid(ageStr: string, restriction: string): boolean {
    // Converte a idade para meses.
    const ageInMonths = parseAge(ageStr);

    if (ageInMonths < 0) return true

    // Separa as condições (usando "e" como separador).
    const conditions = restriction.split(/\s+e\s+/i);

    // Determina uma unidade padrão das condições, se alguma delas definir explicitamente.
    let defaultUnit: string | undefined = undefined;
    for (const cond of conditions) {
        const match = cond.match(/^\s*[<>]\s*\d+\s*(mês|meses|anos?)\s*$/i);
        if (match && match[1]) {
            // A regex não garante posição exata; refaz a captura da unidade.
            const unitMatch = cond.match(/(mês|meses|anos?)/i);
            if (unitMatch) {
                defaultUnit = unitMatch[1].toLowerCase();
                break;
            }
        }
    }

    // Para cada condição, converte para número em meses e valida.
    for (const cond of conditions) {
        const { operator, value } = parseCondition(cond, defaultUnit);
        if (operator === ">") {
            if (!(ageInMonths >= value)) {
                return false;
            }
        } else if (operator === "<") {
            if (!(ageInMonths < value)) {
                return false;
            }
        }
    }

    return true;
}

export function parseDescriptionWithCondition(ageStr: string, input: string): { text: string; valid: boolean, textOrNull: string | null } {
    const ageInMonths = parseAge(ageStr);
    if (ageInMonths < 0)
        return { text: input, valid: true, textOrNull: input };

    const regex = /(.*)\s*\(([^)]+)\)\s*$/;
    const match = input.match(regex);
    if (!match) {
        return { text: input, valid: true, textOrNull: input };
    }
    const text = match[1];
    const condition = match[2].trim();
    const valid = isAgeValid(ageStr, condition);
    return { text, valid, textOrNull: valid ? text : null };
}

export function formatTextBasedOnAge(ageStr: string, input: string): string {
    if (!ageStr) {
        return input;
    }
    const ageInMonths = parseAge(ageStr);
    if (ageInMonths < 0)
        return input    

    return input.replace(/{([^}]+)}/g, (_, part) => {
        const { text, valid } = parseDescriptionWithCondition(ageStr, part)
        return valid ? text : ''
    })
}

// // Test cases:
// console.log(formatTextBasedOnAge("1 ano", "Você é {adulto (> 18 anos)} {criança (< 18 anos)}."));
// // Espera: "Você é criança" 
// // (1 ano = 12 meses não satisfaz > 18 anos e satisfaz < 18 anos)

// console.log(formatTextBasedOnAge("20 anos", "Você é {adulto (> 18 anos)} {criança (< 18 anos)}."));
// // Espera: "Você é adulto" 
// // (20 anos = 240 meses satisfaz > 18 anos e não satisfaz < 18 anos)

// console.log(formatTextBasedOnAge(undefined, "Olá {nome (qualquer condição)}."));
// // Espera: "Olá {nome (qualquer condição)}." 
// // (Sem idade, retorna a string original)

// console.log(formatTextBasedOnAge("2 meses", "Você é {bebê (< 1 ano)} {adulto (> 18 anos)}."));
// // Espera: "Você é bebê" 
// // (2 meses satisfaz < 1 ano (12 meses) e falha em > 18 anos)

// // Exemplos de teste:
// console.log(isAgeValid("1 ano", "> 6 meses")); // true (12 > 6)
// console.log(isAgeValid("2 meses", "< 1 ano"));   // true (2 < 12)
// console.log(isAgeValid("10 anos", "> 7 e < 16 anos")); // true (120 > 84 e 120 < 192)
// console.log(isAgeValid("1 ano", "> 6 meses e < 2 anos")); // true (12 > 6 e 12 < 24)

// console.log(isAgeValid("1 ano", "> 1 ano")); // true (12 > 6)
// console.log(isAgeValid("1 ano", "< 1 ano")); // true (12 > 6)
