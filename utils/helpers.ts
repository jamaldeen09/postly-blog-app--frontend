export function formatPostCreationDate(isoString: string): string {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}



