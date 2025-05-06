import { Button, Form } from 'react-bootstrap'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { z, ZodTypeAny, ZodError } from 'zod'
import ReactSelect from 'react-select'
import _ from 'lodash'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { calculateAge } from './age'
import Pessoa from "@/components/sei/Pessoa"
import { Editor } from '@tinymce/tinymce-react'
import QuantidadeServidoresTeletrabalho from "@/components/QuantidadeServidoresTeletrabalho";
import axios from 'axios';

//const TINYMCE_API_KEY = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;
const TINYMCE_API_KEY = 'no-api-key';

export const numericString = (schema: ZodTypeAny) => z.preprocess((a) => {
    if (typeof a === 'string') {
        return parseInt(a, 10)
    } else if (typeof a === 'number') {
        return a;
    } else {
        return undefined;
    }
}, schema);

type FieldErrorProps = {
    formState: FormState
    name: string
}

type FormErrorProps = {
    formState: FormState
}

const FieldError = ({ formState, name }: FieldErrorProps) => {
    if (!formState.fieldErrors || !formState.fieldErrors[name]) return ''
    return (
        <span className="text-danger">
            {formState.fieldErrors[name]?.[0]}
        </span>
    )
}

const FormError = ({ formState }: FormErrorProps) => {
    if (formState.status !== "ERROR") return ''
    return (
        <span className="text-danger align-middle">
            <strong>Erro! </strong>{formState?.message} <span style={{ display: 'none' }}>{JSON.stringify(formState)}</span>
        </span>
    )
}

export { FieldError, FormError }

export type FormState = {
    status: 'UNSET' | 'SUCCESS' | 'ERROR'
    message: string
    fieldErrors: Record<string, string[] | undefined>
    timestamp: number
}

export const EMPTY_FORM_STATE: FormState = {
    status: 'UNSET' as const,
    message: '',
    fieldErrors: {},
    timestamp: Date.now(),
}

export const getPathReference = (path: (string | number)[]): string => {
    const segments = path.reduce((acc: string, segment, index) => {
        if (typeof segment === 'number') {
            return `${acc}[${segment}]`
        } else {
            return index === 0 ? `${segment}` : `${acc}.${segment}`
        }
    }, '');
    return segments as string;
}

export const fromErrorToFormState = (error: unknown) => {
    if (error instanceof ZodError) {
        const fieldErrors = error.errors.reduce((acc, e) => {
            if (!acc[getPathReference(e.path)])
                acc[getPathReference(e.path)] = [e.message]
            else
                acc[getPathReference(e.path)].push(e.message)
            return acc
        }, {} as any)
        return {
            status: 'ERROR' as const,
            message: '',
            fieldErrors,
            timestamp: Date.now()
        }
    } else if (error instanceof Error) {
        return {
            status: 'ERROR' as const,
            message: error.message,
            fieldErrors: {},
            timestamp: Date.now(),
        }
    } else {
        return {
            status: 'ERROR' as const,
            message: 'An unknown error occurred',
            fieldErrors: {},
            timestamp: Date.now(),
        }
    }
}

export class FormHelper {
    data: any;
    setData: ((data: any) => void) | undefined = undefined;
    formState: FormState = EMPTY_FORM_STATE;

    public update = (data: any, setData?: ((data: any) => void), formState?: FormState) => {
        this.data = data
        this.setData = setData
        this.formState = formState as FormState
    }

    public get = (name: string) => {
        return _.get(this.data, name)
    }

    public set = (name: string, value: any) => {
        if (this.setData) {
            const newData = { ...this.data }
            _.set(newData, name, value)
            this.setData(newData)
            this.data = newData
        }
    }

    public colClass = (width?: string | number) => `mt-3 col ${typeof width === 'string' ? width : `col-12 col-md-${width || 12}`}`

    public Input = ({ label, name, width, readOnly = false, disabled = false, }: { label: string, name: string, width?: number | string, readOnly?: boolean, disabled?: boolean, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
        if (label === null) return null
        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name} key={name}>
                {label && <Form.Label>{label}</Form.Label>}
                <Form.Control name={name} type="text" value={this.get(name)} onChange={e => this.set(name, e.target.value)} placeholder="" key={name} readOnly={readOnly} disabled={disabled}/>
                <FieldError formState={this.formState} name={name} />
            </Form.Group>
        ) : (
            <div className={this.colClass(width)}>
                {label && <Form.Label className="report-label"><div>{label}</div></Form.Label>}
                <p className="report-field"><strong>{this.get(name)}</strong></p>
            </div>
        )
    }

    public DatePicker = ({ label, name, width, addAge }: { label: string, name: string, addAge?: boolean, width?: number | string }) => {
        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name}>
                <Form.Label>{label}</Form.Label>
                <DatePicker selected={this.get(name)} onChange={(date) => this.set(name, date)} className="form-control" dateFormat="dd/MM/yyyy" selectsMultiple={false as true} />
                <FieldError formState={this.formState} name={name} />
            </Form.Group>
        ) : (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                <p>
                    <strong>
                        {this.get(name)
                            ? new Date(this.get(name)).toLocaleDateString('en-GB') +
                            (addAge
                                ? ` (${calculateAge(this.get(name))})`
                                : '')
                            : ''}
                    </strong>
                </p>
            </div>
        );
    }


    public dateInput = ({ label, name, width }: { label: string, name: string, width?: number | string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
        const formatDate = (date: string) => {
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}`;
        };

        const parseDate = (date: string) => {
            const [day, month, year] = date.split('/');
            return `${year}-${month}-${day}`;
        };

        const value = this.get(name) || '';

        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name} key={name}>
                {label && <Form.Label>{label}</Form.Label>}
                <Form.Control
                    name={name}
                    type="date"
                    value={value ? parseDate(value) : ''}
                    onChange={e => this.set(name, formatDate(e.target.value))}
                    placeholder=""
                    key={name}
                />
                <FieldError formState={this.formState} name={name} />
            </Form.Group>
        ) : (
            <div className={this.colClass(width)}>
                {label && <Form.Label className="report-label"><div>{label}</div></Form.Label>}
                <p className="report-field"><strong>{value}</strong></p>
            </div>
        );
    }
    public timeInput = ({ label, name, width }: { label: string, name: string, width?: number | string }) => {
        const formatTime = (time: string) => {
            const [hours, minutes] = time.split(':');
            return `${hours}:${minutes}`;
        };

        const parseTime = (time: string) => {
            const [hours, minutes] = time.split(':');
            return `${hours}:${minutes}`;
        };

        const value = this.get(name) || '';

        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name} key={name}>
                {label && <Form.Label>{label}</Form.Label>}
                <Form.Control
                    name={name}
                    type="time"
                    value={value ? parseTime(value) : ''}
                    onChange={e => this.set(name, formatTime(e.target.value))}
                    placeholder=""
                    key={name}
                />
                <FieldError formState={this.formState} name={name} />
            </Form.Group>
        ) : (
            <div className={this.colClass(width)}>
                {label && <Form.Label className="report-label"><div>{label}</div></Form.Label>}
                <p className="report-field"><strong>{value}</strong></p>
            </div>
        );
    }

    public TextArea = ({ label, name, width }: { label: string | null, name: string, width?: number | string }) => {
        if (label === null) return null
        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name}>
                <Form.Label>{label}</Form.Label>
                <ReactTextareaAutosize className="form-control" name={name} value={this.get(name)} onChange={e => this.set(name, e.target.value)} placeholder="" key={name} />
                <FieldError formState={this.formState} name={name} />
            </Form.Group>
        ) : (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                <p><strong dangerouslySetInnerHTML={{ __html: (this.get(name) || '').split('\n').join('<br />') }}></strong></p>
            </div>
        )
    }

    public Select = ({ label, name, options, width, onChange }: { label: string, name: string, options: { id: string, name: string }[], width?: number | string, onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => {
        if (label === null) return null
        const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            this.set(name, e.target.value);
            if (onChange) {
                onChange(e);
            }
        };
        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name}>
                <Form.Label>{label}</Form.Label>
                <Form.Select name={name} value={this.get(name)} onChange={handleChange}>
                    {options.map(c => (<option value={c.id} key={c.id}>{c.name}</option>))}
                </Form.Select>
                <FieldError formState={this.formState} name={name} />
            </Form.Group>
        ) : (
            <div className={this.colClass(width)}>
                {label && <Form.Label className="report-label"><div>{label}</div></Form.Label>}
                <p className="report-field"><strong>{options.find(option => option.id === this.get(name))?.name}</strong></p>
            </div>
        );
    }

    public SelectAutocomplete = ({ label, name, options, width }: { label: string, name: string, options: { id: string, name: string }[], width?: number | string }) => {


        const selectedOption = options.find(option => option.id === this.get(name));
        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name}>
                <Form.Label>{label}</Form.Label>
                <ReactSelect name={name} value={selectedOption ? { value: selectedOption.id, label: selectedOption.name } : 'Selecione'} defaultValue={this.get(name)} onChange={e => this.set(name, e.value)} options={options.map(i => ({ value: i.id, label: i.name }))} />
                <FieldError formState={this.formState} name={name} />
            </Form.Group >
        ) : (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                <p><strong>{options.find(option => option.id === this.get(name))?.name}</strong></p>
            </div>
        )
    }

    public CheckBoxes = ({ label, labelsAndNames, width }: { label: string, labelsAndNames: { label: string, name: string }[], width?: number | string }) => {
        return this.setData ? (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                {labelsAndNames.map((c, idx) => {
                    return (
                        <Form.Check key={c.name} type="checkbox" label={c.label} checked={this.get(c.name)} onChange={e => this.set(c.name, e.target.checked)} />
                    )
                })}
            </div>
        ) : (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                <table className="table table-bordered">
                    <tbody>
                        {labelsAndNames.map((c, idx) => {
                            return (
                                <tr key={c.name}>
                                    <td>{c.label}</td>
                                    <td><strong>{this.get(c.name) ? 'Sim' : 'Não'}</strong></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    public RadioButtonsTable = ({ label, labelsAndNames, options, width }: { label: string, labelsAndNames: { label: string, name: string }[], options: { id: string, name: string }[], width?: number | string }) => {
        if (!labelsAndNames || labelsAndNames.length === 0) return null
        return this.setData ? (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th></th>
                            {options.map((o, idx) => <th key={o.id}>{o.name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {labelsAndNames.map((c, idx) => {
                            return (
                                <tr key={c.name}>
                                    <td>{c.label}</td>
                                    {options.map((o, idx) => {
                                        return (
                                            <td key={o.id}>
                                                <Form.Check type="radio" name={c.name} value={o.id} checked={this.get(c.name) === o.id} onChange={e => this.set(c.name, e.target.value)} />
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                <table className="table table-bordered" >
                    <thead>
                        <tr>
                            <th></th>
                            {options.map((o, idx) => <th key={o.id} className="text-center">{o.name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {labelsAndNames.map((c, idx) => {
                            return (
                                <tr key={c.name}>
                                    <td>{c.label}</td>
                                    {options.map((o, idx) => {
                                        return (
                                            <td key={o.id} className="text-center">
                                                {this.get(c.name) === o.id ? 'X' : ''}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    public CPFInput = ({ label, name, width }: { label: string; name: string; width?: number | string }) => {
        const formatCPF = (value: string) => {
            const numericValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos
            return numericValue
                .replace(/^(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
                .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3') // Adiciona o segundo ponto
                .replace(/\.(\d{3})(\d)/, '.$1-$2') // Adiciona o hífen
                .slice(0, 14); // Limita o tamanho ao formato de CPF
        };
    
        const parseCPF = (value: string) => {
            return value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        };
    
        const value = this.get(name) || ''; // Obtém o valor atual do campo
    
        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name} key={name}>
                {label && <Form.Label>{label}</Form.Label>}
                <Form.Control
                    name={name}
                    type="text"
                    value={formatCPF(value)} // Formata o CPF para exibição no campo
                    onChange={(e) => this.set(name, parseCPF(e.target.value))} // Remove formatação ao salvar
                    placeholder="000.000.000-00"
                    key={name}
                />
                <FieldError formState={this.formState} name={name} />
            </Form.Group>
        ) : (
            <div className={this.colClass(width)}>
                {label && <Form.Label className="report-label"><div>{label}</div></Form.Label>}
                <p className="report-field"><strong>{formatCPF(value)}</strong></p> {/* Formata o CPF no preview */}
            </div>
        );
    };

    public NameInput = ({ label, name, width }: { label: string; name: string; width?: number | string }) => {
        const formatName = (value: string) => {
            return value.toUpperCase(); // Converte todo o texto para maiúsculas
        };
    
        const parseName = (value: string) => {
            return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''); // Remove caracteres inválidos (apenas letras e espaços)
        };
    
        const value = this.get(name) || ''; // Obtém o valor atual do campo
    
        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name} key={name}>
                {label && <Form.Label>{label}</Form.Label>}
                <Form.Control
                    name={name}
                    type="text"
                    value={formatName(value)} // Formata o nome para exibição no campo
                    onChange={(e) => this.set(name, parseName(e.target.value))} // Remove caracteres inválidos ao salvar
                    placeholder="DIGITE O NOME COMPLETO"
                    key={name}
                />
                <FieldError formState={this.formState} name={name} />
            </Form.Group>
        ) : (
            <div className={this.colClass(width)}>
                {label && <Form.Label className="report-label"><div>{label}</div></Form.Label>}
                <p className="report-field"><strong>{formatName(value)}</strong></p> {/* Formata o nome no preview */}
            </div>
        );
    };

    public MoneyInput = ({ label, name, width }: { label: string, name: string, width?: number | string }) => {
        const formatCurrency = (value: string) => {
            const numericValue = value.replace(/\D/g, '');
            const formattedValue = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(parseFloat(numericValue) / 100);
            return formattedValue.replace('R$', '').trim();
        };

        const parseCurrency = (value: string) => {
            return value.replace(/\D/g, '');
        };

        const value = this.get(name) || '0';

        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name} key={name}>
                {label && <Form.Label>{label}</Form.Label>}
                <Form.Control
                    name={name}
                    type="text"
                    value={formatCurrency(value)}
                    onChange={e => this.set(name, parseCurrency(e.target.value))}
                    placeholder=""
                    key={name}
                />
                <FieldError formState={this.formState} name={name} />
            </Form.Group>
        ) : (
            <div className={this.colClass(width)}>
                {label && <Form.Label className="report-label"><div>{label}</div></Form.Label>}
                <p className="report-field"><strong>{formatCurrency(value)}</strong></p>
            </div>
        );
    }

    public MoneyInputFloat = ({ label, name, width }: { label: string, name: string, width?: number | string }) => {
        const formatCurrency = (value: number) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(value || 0);
        };

        const parseCurrency = (value: string) => {
            const numericValue = parseFloat(value.replace(/\D/g, '')) / 100;
            return isNaN(numericValue) ? 0 : numericValue;
        };

        const value = this.get(name) || 0;

        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name} key={name}>
                {label && <Form.Label>{label}</Form.Label>}
                <Form.Control
                    name={name}
                    type="text"
                    value={formatCurrency(value)}
                    onChange={e => this.set(name, parseCurrency(e.target.value))}
                    placeholder=""
                    key={name}
                />
                <FieldError formState={this.formState} name={name} />
            </Form.Group>
        ) : (
            <div className={this.colClass(width)}>
                {label && <Form.Label className="report-label"><div>{label}</div></Form.Label>}
                <p className="report-field"><strong>{formatCurrency(value)}</strong></p>
            </div>
        );
    };

    public Button = ({ onClick, variant, children }: { onClick: () => void, variant?: string, children: any }) => {
        return this.setData ? (
            <div className="col col-auto mt-3">
                <label className="form-label">&nbsp;</label><br />
                <Button variant="light" onClick={onClick}>{children}</Button>
            </div>
        ) : (
            <div className="col col-auto mt-3">
                <label className="form-label">&nbsp;</label><br />
                <p>{children}</p>
            </div>
        )
    }
    public DynamicListPessoa = ({ label, name, width }: { label: string, name: string, width?: number | string }) => {
        const addItem = () => {
            const newData = [...(this.get(name) || []), { sigla: '', descricao: '' }];
            this.set(name, newData);
        };

        const removeItem = (index: number) => {
            const newData = [...(this.get(name) || [])];
            newData.splice(index, 1);
            this.set(name, newData);
        };

        const items = this.get(name) || [];

        return (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                <Button variant="success" onClick={addItem} className="ms-2">+</Button>
                {items.map((_: any, index: number) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                        <div className="flex-grow-1">
                            <Pessoa Frm={this} name={`${name}[${index}]`} label1="Matrícula" label2="Nome" />
                        </div>
                        <Button variant="danger" onClick={() => removeItem(index)} className="ms-2 mt-5">-</Button>
                    </div>
                ))}
            </div>
        );
    }
    public DynamicListParticipantesExtras = ({ label, name, width }: { label: string, name: string, width?: number | string }) => {
        const addItem = () => {
            const newData = [...(this.get(name) || []), { nome: '', email: '', funcao: '', unidade: '' }];
            this.set(name, newData);
        };

        const removeItem = (index: number) => {
            const newData = [...(this.get(name) || [])];
            newData.splice(index, 1);
            this.set(name, newData);
        };

        const items = this.get(name) || [];

        return (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                <Button variant="success" onClick={addItem} className="ms-2">+</Button>
                {items.map((_: any, index: number) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                        <div className="flex-grow-1">
                            <Form.Group className="mb-2">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={this.get(`${name}[${index}].nome`)}
                                    onChange={e => this.set(`${name}[${index}].nome`, e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={this.get(`${name}[${index}].email`)}
                                    onChange={e => this.set(`${name}[${index}].email`, e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Função</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={this.get(`${name}[${index}].funcao`)}
                                    onChange={e => this.set(`${name}[${index}].funcao`, e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Unidade</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={this.get(`${name}[${index}].unidade`)}
                                    onChange={e => this.set(`${name}[${index}].unidade`, e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <Button variant="danger" onClick={() => removeItem(index)} className="ms-2 mt-5">-</Button>
                    </div>
                ))}
            </div>
        );
    }
    public DynamicListItensDePauta = ({ label, name, width }: { label: string, name: string, width?: number | string }) => {
        const addItem = () => {
            const newData = [...(this.get(name) || []), { item: '', comentarios: '', acoes: [] }];
            this.set(name, newData);
        };

        const removeItem = (index: number) => {
            const newData = [...(this.get(name) || [])];
            newData.splice(index, 1);
            this.set(name, newData);
        };

        const addAcao = (itemIndex: number) => {
            const newData = [...(this.get(name) || [])];
            if (!newData[itemIndex].acoes) {
                newData[itemIndex].acoes = [];
            }
            newData[itemIndex].acoes.push({ acao: '', responsavel: '', dataPrevista: '' });
            this.set(name, newData);
        };

        const removeAcao = (itemIndex: number, acaoIndex: number) => {
            const newData = [...(this.get(name) || [])];
            newData[itemIndex].acoes.splice(acaoIndex, 1);
            this.set(name, newData);
        };

        const items = this.get(name) || [];

        return (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                <Button variant="success" onClick={addItem} className="ms-2">+</Button>
                {items.map((item: any, index: number) => (
                    <div key={index} className="mb-2">
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <Form.Group className="mb-2">
                                    <Form.Label>Item {index + 1}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={this.get(`${name}[${index}].item`)}
                                        onChange={e => this.set(`${name}[${index}].item`, e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Comentários</Form.Label>
                                    <Editor
                                        apiKey={TINYMCE_API_KEY}
                                        value={this.get(`${name}[${index}].comentarios`) || ''}
                                        init={{
                                            height: 300,
                                            menubar: false,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar:
                                                'undo redo | formatselect | bold italic backcolor | \
                                                alignleft aligncenter alignright alignjustify | \
                                                bullist numlist outdent indent | removeformat | help'
                                        }}
                                        onEditorChange={(content) => {
                                            this.set(`${name}[${index}].comentarios`, content);
                                        }}
                                    />
                                </Form.Group>
                            </div>
                            <Button variant="danger" onClick={() => removeItem(index)} className="ms-2 align-self-start">-</Button>
                        </div>
                        <Form.Label>Ações</Form.Label>
                        <Button variant="success" onClick={() => addAcao(index)} className="ms-2">+</Button>
                        {item.acoes?.map((acao: any, acaoIndex: number) => (
                            <div key={acaoIndex} className="d-flex align-items-center mb-2">
                                <div className="flex-grow-1">
                                    <Form.Group className="mb-2">
                                        <Form.Label>Ação {acaoIndex + 1}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.get(`${name}[${index}].acoes[${acaoIndex}].acao`)}
                                            onChange={e => this.set(`${name}[${index}].acoes[${acaoIndex}].acao`, e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Responsável</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.get(`${name}[${acaoIndex}].responsavel`)}
                                            onChange={e => this.set(`${name}[${acaoIndex}].responsavel`, e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Data Prevista</Form.Label>
                                        <this.dateInput
                                            label=""
                                            name={`${name}[${index}].acoes[${acaoIndex}].dataPrevista`}
                                            width={12}
                                        />
                                    </Form.Group>
                                </div>
                                <Button variant="danger" onClick={() => removeAcao(index, acaoIndex)} className="ms-2 align-self-start">-</Button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    public DynamicListDadosEmbarque = ({ label, name, width }: { label: string, name: string, width?: number | string }) => {

        const formatDate = (date: string) => {
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}`;
        };

        const parseDate = (date: string) => {
            const [day, month, year] = date.split('/');
            return `${year}-${month}-${day}`;
        };

        const value = this.get(name) || '';

        const addItem = () => {
            const newData = [...(this.get(name) || []), { data_de_embarque: '', trecho: '', Empresa: '', vooLInha: '' }];
            this.set(name, newData);
        };

        const removeItem = (index: number) => {
            const newData = [...(this.get(name) || [])];
            newData.splice(index, 1);
            this.set(name, newData);
        };

        const items = this.get(name) || [];

        return (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                <Button variant="success" onClick={addItem} className="ms-2 m-2">+</Button>
                {items.map((_: any, index: number) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                        <div className="flex-grow-1 card p-3 m-2" style={{ backgroundColor: '#edf7fe' }}>
                            <Form.Group className="mb-2">
                                <Form.Label>Data de Embarque</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={value ? parseDate(this.get(`${name}[${index}].data_de_embarque`)) : ''}
                                    onChange={e => this.set(`${name}[${index}].data_de_embarque`, formatDate(e.target.value))}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Trecho</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={this.get(`${name}[${index}].trecho`)}
                                    onChange={e => this.set(`${name}[${index}].trecho`, e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Empresa</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={this.get(`${name}[${index}].empresa`)}
                                    onChange={e => this.set(`${name}[${index}].empresa`, e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Vôo/Linha</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={this.get(`${name}[${index}].vooLinha`)}
                                    onChange={e => this.set(`${name}[${index}].vooLinha`, e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <Button variant="danger" onClick={() => removeItem(index)} className="ms-2 mt-5">-</Button>
                    </div>
                ))}
            </div>
        );
    }

    public QuantidadeServidoresTeletrabalho = ({ label, name, width }: { label: string, name: string, width?: number | string }) => {
        return this.setData ? (
            <QuantidadeServidoresTeletrabalho Frm={this} name={name} />
        ) : (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                {this.get(name)?.map((servidor: any, i: number) => (
                    <div key={i} className="row">
                        <div className="col-3">
                            <Form.Label>{i === 0 ? 'Nome do Servidor' : ''}</Form.Label>
                            <p><strong>{servidor.nome}</strong></p>
                        </div>
                        <div className="col-3">
                            <Form.Label>{i === 0 ? 'Período' : ''}</Form.Label>
                            <p><strong>{servidor.periodo}</strong></p>
                        </div>
                        <div className="col-3">
                            <Form.Label>{i === 0 ? 'Data de Envio' : ''}</Form.Label>
                            <p><strong>{servidor.dataEnvio}</strong></p>
                        </div>
                        <div className="col-3">
                            <Form.Label>{i === 0 ? 'Número' : ''}</Form.Label>
                            <p><strong>{servidor.numero}</strong></p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    public RadioButtons = ({ label, name, options, width }: { label: string, name: string, options: { id: string, name: string }[], width?: number | string }) => {
        return this.setData ? (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                {options.map((option, idx) => (
                    <Form.Check
                        key={option.id}
                        type="radio"
                        label={option.name}
                        name={name}
                        value={option.id}
                        checked={this.get(name) === option.id}
                        onChange={e => this.set(name, e.target.value)}
                    />
                ))}
            </div>
        ) : (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                <p className="report-field"><strong>{options.find(option => option.id === this.get(name))?.name}</strong></p>
            </div>
        )
    }

    // add space
    public Space = ({ px }) => {
        return (
            <div style={{ marginTop: px }}></div>
        )
    }

    public DynamicListTrajeto = ({ label, name, width }: { label: string, name: string, width?: number | string }) => {
        const addItem = () => {
            const newData = [...(this.get(name) || []), { origem: '', destino: '', transporteAteEmbarque: '1', transporteAposDesembarque: '1', hospedagem: '1', dataTrecho: '' }];
            this.set(name, newData);
        };

        const removeItem = (index: number) => {
            const newData = [...(this.get(name) || [])];
            newData.splice(index, 1);
            this.set(name, newData);
        };

        const handleReturnToOrigin = (checked: boolean) => {
            const items = this.get(name) || [];
            if (checked) {
                if (items.length > 0) {
                    const newItem = {
                        origem: items[items.length - 1].destino,
                        destino: items[0].origem,
                        transporteAteEmbarque: '1',
                        transporteAposDesembarque: '1',
                        hospedagem: '1',
                        dataTrecho: ''
                    };
                    const newData = [...items, newItem];
                    this.set(name, newData);
                }
            } else {
                const newData = items.slice(0, -1);
                this.set(name, newData);
            }
        };

        const items = this.get(name) || [];
        const transporteOptions = [
            { id: '1', name: 'Com adicional de deslocamento' },
            { id: '2', name: 'Sem adicional de deslocamento' },
            { id: '3', name: 'Veículo oficial' }
        ];
        const hospedagemOptions = [
            { id: '1', name: 'Sim' },
            { id: '2', name: 'Não' }
        ];

        return (
            <div className={this.colClass(width)}>
                <div className="d-flex align-items-center">
                    <Form.Label><strong>{label}</strong></Form.Label>
                    <Button variant="success" onClick={addItem} className="ms-2">Adicionar percurso</Button>
                    <div hidden>
                    <Form.Check
                        type="checkbox"
                        label="Retorno à origem"
                        onChange={e => handleReturnToOrigin(e.target.checked)}
                        className="ms-2"
                    />
                    </div>
                </div>
                {items.map((_: any, index: number) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                        <div className="flex-grow-1">
                            <div className="row">
                                <Form.Group className="mb-2 col-md-6">
                                    <Form.Label>Origem</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={this.get(`${name}[${index}].origem`)}
                                        onChange={e => this.set(`${name}[${index}].origem`, e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2 col-md-6">
                                    <Form.Label>Destino</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={this.get(`${name}[${index}].destino`)}
                                        onChange={e => this.set(`${name}[${index}].destino`, e.target.value)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="row">
                                <Form.Group className="mb-2 col-md-6">
                                    <Form.Label>Transporte até o embarque</Form.Label>
                                    <Form.Select
                                        value={this.get(`${name}[${index}].transporteAteEmbarque`)}
                                        onChange={e => this.set(`${name}[${index}].transporteAteEmbarque`, e.target.value)}
                                    >
                                        {transporteOptions.map(option => (
                                            <option key={option.id} value={option.id}>{option.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-2 col-md-6">
                                    <Form.Label>Transporte após o desembarque</Form.Label>
                                    <Form.Select
                                        value={this.get(`${name}[${index}].transporteAposDesembarque`)}
                                        onChange={e => this.set(`${name}[${index}].transporteAposDesembarque`, e.target.value)}
                                    >
                                        {transporteOptions.map(option => (
                                            <option key={option.id} value={option.id}>{option.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="row">
                                <Form.Group className="mb-2 col-md-6">
                                    <Form.Label>Data do Trecho</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={this.get(`${name}[${index}].dataTrecho`) || ''}
                                        onChange={e => this.set(`${name}[${index}].dataTrecho`, e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2 col-md-6">
                                    <Form.Label>Hospedagem custeada/fornecida por órgão da administração pública</Form.Label>
                                    <Form.Select
                                        value={this.get(`${name}[${index}].hospedagem`)}
                                        onChange={e => this.set(`${name}[${index}].hospedagem`, e.target.value)}
                                    >
                                        {hospedagemOptions.map(option => (
                                            <option key={option.id} value={option.id}>{option.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                        <Button variant="danger" onClick={() => removeItem(index)} className="ms-2 mt-5">-</Button>
                    </div>
                ))}
            </div>
        );
    };

    public InputWithButton = ({ label, name, buttonText, onButtonClick, width }: { label: string, name: string, buttonText: string, onButtonClick: (value: string) => void, width?: number | string }) => {
        const handleButtonClick = () => {
            const value = this.get(name);
            onButtonClick(value);
        };

        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name} key={name}>
                {label && <Form.Label>{label}</Form.Label>}
                <div className="d-flex">
                    <Form.Control name={name} type="text" value={this.get(name)} onChange={e => this.set(name, e.target.value)} placeholder="" key={name} />
                    <Button variant="primary" onClick={handleButtonClick} className="ms-2">{buttonText}</Button>
                </div>
                <FieldError formState={this.formState} name={name} />
            </Form.Group>
        ) : (
            <div className={this.colClass(width)}>
                {label && <Form.Label className="report-label"><div>{label}</div></Form.Label>}
                <p className="report-field"><strong>{this.get(name)}</strong></p>
            </div>
        );
    }

    public FeriadosInput = ({ label, name, width }: { label: string, name: string, width?: number | string }) => {
        const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const quantity = parseInt(e.target.value, 10);
            const feriados = this.get(name) || [];
            const newFeriados = feriados.slice(0, quantity);
            while (newFeriados.length < quantity) {
                newFeriados.push('');
            }
            this.set(name, newFeriados);
        };

        const handleDateChange = (index: number, date: string) => {
            const feriados = this.get(name) || [];
            feriados[index] = date;
            this.set(name, feriados);
        };

        const quantityOptions = Array.from({ length: 31 }, (_, i) => ({ id: `${i}`, name: `${i}` }));
        const feriados = this.get(name) || [];

        return (
            <div className={this.colClass(width)}>
                <Form.Label>{label}</Form.Label>
                <Form.Select onChange={handleQuantityChange} value={feriados.length}>
                    {quantityOptions.map(option => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                </Form.Select>
                {feriados.map((feriado: string, index: number) => (
                    <Form.Group key={index} className="mt-2">
                        <Form.Label>Data {index + 1}</Form.Label>
                        <Form.Control
                            type="date"
                            value={feriado}
                            onChange={e => handleDateChange(index, e.target.value)}
                        />
                    </Form.Group>
                ))}
            </div>
        );
    };
}

// Remove accents, remove spaces, to camelcase, first letter lowercase
export const labelToName = (label: string) => {
    return label
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\b\w/g, char => char.toUpperCase())
        .replace(/ /g, '')
        .replace(/^./, char => char.toLowerCase());
}

