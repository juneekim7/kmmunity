import "./Modal.css"

interface ModalProps {
    children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = (props) => {
    return (
        <div className="modal">
            {props.children}
        </div>
    )
}

export default Modal