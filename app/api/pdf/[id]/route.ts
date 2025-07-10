export const runtime = 'edge'
export const maxDuration = 60

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const id: string = params?.id
    const json = await req.formData()
    const html = json.get('html')

    const formated = `<html>
    <head>
    </head>
    <body>
    <style>
        .h-print { display: none; }
        button { display: none; }
        a.back-button { display: none; }
        h1 { text-align: center; }
        .text-center { text-align: center; }
        .mb-0 { margin-bottom: 0}
        .mb-4 { margin-bottom: 1.5em }
        .mt-3 { margin-top: 0.8cm; }
        .d-none { display: none !important; }
        .w-100 { width: 18cm; }
        p { margin: 0; }

        table.table { width: 18cm; }
        table.table-bordered, table.table-bordered th, table.table-bordered td  { width: 100%; border-collapse: collapse; border: 1px solid black; }

        div.assinatura { text-align: center; margin-top: 1.5cm; }

        label.form-label { font-size: 100%; color: gray;}

        @page {
            size: a4;
            margin: 1cm 1cm 1.5cm 1.5cm;
            @bottom-right {
            content: counter(page);	
            }
        }

        body {
            margin: 0;
            padding: 0;
        }
        
        .row {
            margin: 0em -0em 0em 0em;
        }
        
        .col {
            display: inline-block;
            vertical-align: text-top;
            margin-right: -0em;
            padding: 0;
        }
        
        .col-md-12 {
            width: 18cm;
        }
        
        .col-md-11 {
            width: 16.5cm;
        }
        
        .col-md-10 {
            width: 15cm;
        }
        
        .col-md-9 {
            width: 13.5cm;
        }
        
        .col-md-8 {
            width: 12cm;
        }
        
        .col-md-7 {
            width: 10.5cm;
        }
        
        .col-md-6 {
            width: 9cm;
        }
        
        .col-md-5 {
            width: 7.5cm;
        }
        
        .col-md-4 {
            width: 6cm;
        }
        
        .col-md-3 {
            width: 4.5cm;
        }
        
        .col-md-2 {
            width: 3cm;
        }
        
        .col-md-1 {
            width: 1.5cm;
        }
    </style>

    ${html}
    </body>
    </html>`

    // console.log('formated', formated)

    const formData = new FormData();
    formData.append('conv', '2');
    formData.append('html', formated);
    formData.append('skipTemplate', 'true');

    const res = await fetch(`https://apoia.pdpj.jus.br/api/pdf/${id}`, {
        method: 'post',
        body: formData,
        cache: 'no-store'
    })
    const pdf = await res.arrayBuffer();

    const headers = new Headers();
    headers.append("Content-Disposition", `attachment; filename="${id}.pdf"`);
    headers.append("Content-Type", "application/pdf");
    headers.append("Content-Length", pdf.byteLength.toString());

    return new Response(pdf, { headers })
}
