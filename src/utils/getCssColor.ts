export const getCssColor = (varibaleName: string)=>{
   const style = getComputedStyle(document.documentElement)


return style.getPropertyValue(varibaleName).trim()
}