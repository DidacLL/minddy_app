interface RegisterProps {
    onSubmit: (userName: string,navigator:any) => void
}

export function Register({onSubmit}: RegisterProps) {
    return <h1>Register form</h1>;
}