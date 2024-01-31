'use client'
export default function WorkOrderDownloadLink({wo}) {
    return (
        <img src="/images/file-arrow-down-solid.svg" onClick={async () => {
            const res = await fetch(`/dashboard/get/api/get-work-order-pdf?id=${wo.id}`).then(res => res)
            const blob = await res.blob();
            const newBlob = new Blob([blob]);

            const blobUrl = window.URL.createObjectURL(newBlob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `WO-${wo.number}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);

            // clean up Url
            window.URL.revokeObjectURL(blobUrl);
        }} alt='Download Work Order PDF' className="h-8 object-contain cursor-pointer"/>
    )
}