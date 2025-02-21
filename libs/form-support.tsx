import { Button, Form } from 'react-bootstrap'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { z, ZodTypeAny, ZodError } from 'zod'
import ReactSelect from 'react-select'
import _ from 'lodash'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { calculateAge } from './age'

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

    public Input = ({ label, name, width }: { label: string, name: string, width?: number | string }) => {
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

    public DatePicker = ({ label, name, width, addAge }: { label: string, name: string, addAge?: boolean, width?: number | string }) => {
        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name}>
                <Form.Label>{label}</Form.Label>
                <DatePicker
                    selected={this.get(name)}
                    onChange={(date) => this.set(name, date)}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                />
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
                <Form.Label>{label}</Form.Label>
                <p><strong>{options.find(option => option.id === this.get(name))?.name}</strong></p>
            </div>
        )
    }

    public SelectAutocomplete = ({ label, name, options, width }: { label: string, name: string, options: { id: string, name: string }[], width?: number | string }) => {
        return this.setData ? (
            <Form.Group className={this.colClass(width)} controlId={name}>
                <Form.Label>{label}</Form.Label>
                <ReactSelect name={name} defaultValue={this.get(name)} onChange={e => this.set(name, e.value)} options={options.map(i => ({ value: i.id, label: i.name }))} />
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

