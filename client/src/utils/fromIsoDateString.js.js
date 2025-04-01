export const fromIsoDateString = (isoDate)=>{
    const date = new Date(isoDate);
    const formattedDate = date.toLocaleString('en-US', 
        {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric',
            second: 'numeric'
        })

    return formattedDate;
}