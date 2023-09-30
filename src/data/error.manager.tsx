import React, {ErrorInfo, ReactNode} from "react";
import {ErrorType} from "./enums/ErrorType";

interface State {
    hasError: ErrorType|undefined;
}

interface Props {
    children: ReactNode;
    onError: React.JSX.Element;
}

export class ErrorManager extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: undefined };
    }

    static getDerivedStateFromError(error: any) {
        // Actualiza el estado para que el siguiente renderizado muestre la interfaz de respaldo.
        console.log(error)
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // También puedes registrar el error en un servicio de informes de errores.
        console.log("Error: " + error);
        console.log("ErrorInfo: " + JSON.stringify(errorInfo));
        console.log("ComponentStack: " + errorInfo.componentStack);
    }

    render() {
        if (this.state.hasError) {
            // Puedes renderizar cualquier interfaz de respaldo personalizada.
            return <h1>Algo salió mal...</h1>;
        }

        return this.props.children;
    }

}

export default ErrorManager;
