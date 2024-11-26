import { decode } from 'punycode';
import React, { useState } from 'react';


const TextareaComponent = () => {
  // Texto codificado (com entidades HTML)
  const textoCodificado = "Esta unidade manteve sua compet&ecirc;ncia material para processar e julgar execu&ccedil;&atilde;o fiscal, bem como, as a&ccedil;&otilde;es de impugna&ccedil;&atilde;o dela decorrentes (art. 38 da Lei n&ordm; 6.830/80), nos termos do art. 24 da Resolu&ccedil;&atilde;o n&ordm; 21, de 08/07/2016, do TRF da 2&ordf; Regi&atilde;o.";

  // Decodificando o texto HTML
  const textoDecodificado = decode(textoCodificado);

  const [texto, setTexto] = useState(textoDecodificado);

  const handleChange = (e: any) => {
    setTexto(e.target.value);
  };

  return (
    <div>
      <textarea
        value={texto}
        onChange={handleChange}
        rows={10}
        cols={50}
      />
    </div>
  );
};

export default TextareaComponent;