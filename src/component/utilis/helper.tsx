export const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB");

export const getPreview = (text: string) =>
    text.length > 20 ? text.slice(0, 20) + "..." : text;