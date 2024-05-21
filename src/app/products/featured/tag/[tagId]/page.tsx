export default function Page({ params: { tagId } }: { params: { tagId: string } }) {
    return (
        <div>
            <h1>Tag: {tagId}</h1>
        </div>
    )
}