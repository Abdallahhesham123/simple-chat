


export function  paginate (page ,size){
    if(!page || page<=0){
      page =1;
    }
    if(!size || size<=0){
      size =2;
    }
    const skippage = (parseInt(page)- 1) * parseInt(size);

    return{ skippage , limit:parseInt(size)}

}