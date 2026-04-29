import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ModalCategoria = ({
    aberto,
    onFechar,
    onSalvar,
    categoriaParaEditar,
    carregando,
    modo = 'criar'
}) => {
    const [nome, setNome] = useState('');
    const [erros, setErros] = useState({});

    useEffect(() => {
        if (aberto && modo === 'editar' && categoriaParaEditar) {
            setNome(categoriaParaEditar.nome || '');
            setErros({});
        } else if (aberto && modo === 'criar') {
            setNome('');
            setErros({});
        }
    }, [aberto, categoriaParaEditar, modo]);

    const validar = () => {
        const novosErros = {};

        if (!nome.trim()) {
            novosErros.nome = 'Nome é obrigatório';
        } else if (nome.trim().length < 3) {
            novosErros.nome = 'Nome deve ter no mínimo 3 caracteres';
        } else if (nome.trim().length > 50) {
            novosErros.nome = 'Nome deve ter no máximo 50 caracteres';
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validar()) {
            return;
        }

        const dados = {
            nome: nome.trim()
        };

        if (modo === 'editar' && categoriaParaEditar) {
            onSalvar({
                id: categoriaParaEditar.id,
                ...dados
            });
        } else {
            onSalvar(dados);
        }

        setNome('');
        setErros({});
    };

    if (!aberto) {
        return null;
    }

    const titulo = modo === 'criar' ? 'Nova Categoria' : 'Editar Categoria';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="bg-[#B30000] text-white px-6 py-4 flex items-center justify-between sticky top-0">
                    <h2 className="text-lg font-semibold">{titulo}</h2>
                    <button
                        onClick={onFechar}
                        disabled={carregando}
                        className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors disabled:opacity-50"
                        aria-label="Fechar modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
                            Nome da Categoria *
                        </label>
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Ex: Limpeza, Pintura, Manutenção..."
                            maxLength={50}
                            disabled={carregando}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B30000] transition-colors ${erros.nome ? 'border-red-500' : 'border-gray-300'
                                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                        />
                        {erros.nome && (
                            <p className="text-red-500 text-sm mt-1">{erros.nome}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                            {nome.length}/50 caracteres
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onFechar}
                            disabled={carregando}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={carregando}
                            className="flex-1 px-4 py-2 bg-[#B30000] text-white font-semibold rounded-lg hover:bg-[#8B0000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {carregando ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Salvando...</span>
                                </>
                            ) : (
                                <span>{modo === 'criar' ? 'Criar' : 'Atualizar'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCategoria;