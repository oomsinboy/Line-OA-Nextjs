export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const formatCurrentDate = () => {
  const now = new Date();
  const localDate = new Date(now.getTime());
  const year = localDate.getFullYear()+ 543;
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutes = String(localDate.getMinutes()).padStart(2, "0");
  const seconds = String(localDate.getSeconds()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const cleanHtmlContent = (htmlContent:any) => {
  return htmlContent
      .replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, '')
      .replace(/<p>/g, '<span>') // แปลง <p> เป็น <span>
      .replace(/<\/p>/g, '</span><br>') // แปลง </p> เป็น </span><br>
      .replace(/<\/?strong>/g, ''); // ลบ <strong> และ </strong>
      
};

