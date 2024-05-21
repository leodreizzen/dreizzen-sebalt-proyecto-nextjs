export default function Page({searchParams}: {searchParams: {q?: string}}){
    return <div>
        {searchParams.q ? <h1>Resultados de búsqueda para {searchParams.q}</h1> : <h1>Sin parámetros</h1>}
    </div>
}