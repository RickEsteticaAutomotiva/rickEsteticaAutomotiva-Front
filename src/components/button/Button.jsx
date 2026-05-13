export function Button({ texto,  onClick, className = "" }) {

    return (
        <button 
           className={"w-min py-1 px-8 bg-red-700 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors duration-200 " + className}
            onClick={onClick}
        >
            {texto}
        </button>
    );
}