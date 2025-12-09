import { Toast } from './Toast';

export function ContainerToast({ toasts, aoFechar }) {
    return (
        <div className="fixed top-4 left-0 right-0 z-[60] pointer-events-none flex flex-col items-center gap-2">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto w-full flex justify-center">
                    <Toast
                        tipo={toast.tipo}
                        titulo={toast.titulo}
                        subtitulo={toast.subtitulo}
                        mensagem={toast.mensagem}
                        duracao={toast.duracao}
                        aoFechar={() => aoFechar(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
}