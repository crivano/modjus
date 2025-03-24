import { redirect } from 'next/navigation'

export default function RedirectPage() {
    redirect('bpc-loas-pcd?quesito-conclusivo=false')
    return null
}