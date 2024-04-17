
export function getFormatedDate() {
    let date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    const fmt = `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
    return fmt;
  }
  
export function routeTo(pathName) {
    window.location.href = pathName;
  }
  