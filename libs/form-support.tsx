import { Button, Form } from 'react-bootstrap'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { z, ZodTypeAny, ZodError } from 'zod'
import ReactSelect from 'react-select'
import _ from 'lodash'
import Pessoa from "@/components/sei/Pessoa"
import { Editor } from '@tinymce/tinymce-react';
import QuantidadeServidoresTeletrabalho from "@/components/QuantidadeServidoresTeletrabalho";

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

    public Input = ({ label, name, width }: { label: string, name: string, width?: number | string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void}) => {
        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name} key={name}>
                {label && <Form.Label>{label}</Form.Label>}
                <Form.Control name={name} type="text" value={this.get(name)} onChange={e => this.set(name, e.target.value)} placeholder="" key={name} />
                <FieldError formState={this.formState} name={name} />
            </Form.Group>
        ) : (
            <div className={this.colClass(width)}>
                {label && <Form.Label className="report-label"><div>{label}</div></Form.Label>}
                <p className="report-field"><strong>{this.get(name)}</strong></p>
            </div>
        )
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

    public TextArea = ({ label, name, width }: { label: string, name: string, width?: number | string }) => {
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

    public Select = ({ label, name, options, width }: { label: string, name: string, options: { id: string, name: string }[], width?: number | string }) => {
        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name}>
                <Form.Label>{label}</Form.Label>
                <Form.Select name={name} value={this.get(name)} onChange={e => this.set(name, e.target.value)}>
                    {options.map(c => (<option value={c.id} key={c.id}  >{c.name}</option>))}
                </Form.Select>
                <FieldError formState={this.formState} name={name} />
            </Form.Group >
        ) : (
            <div className={this.colClass(width)}>
                {label && <Form.Label className="report-label"><div>{label}</div></Form.Label>}
                <p className="report-field"><strong>{options.find(option => option.id === this.get(name))?.name}</strong></p>
            </div>
        )
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
                                        apiKey="okl0dnjy21cv4l4ea6r0ealf62lttmbjpsbqtevspcitokf4"
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
                                            value={this.get(`${name}[${index}].acoes[${acaoIndex}].responsavel`)}
                                            onChange={e => this.set(`${name}[${index}].acoes[${acaoIndex}].responsavel`, e.target.value)}
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

