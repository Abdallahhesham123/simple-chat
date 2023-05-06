

class ApiFeatures{


    constructor(MongooseQuery , QueryData){

        this.MongooseQuery = MongooseQuery;
        this.QueryData = QueryData;
    }

    paginate(){
       let {page , size} = this.QueryData;
        if(!page || page<=0){
            page =1;
          }
          if(!size || size<=0){
            size =2;
          }
          const skippage = (parseInt(page)- 1) * parseInt(size);
      
          this.MongooseQuery.limit(parseInt(size)).skip(skippage)
          return this
    }

    filter(){

           const ExcludeQueryParams =['page','size','sort','search','fields']
            const FilterQuery ={...this.QueryData}
            ExcludeQueryParams.forEach(element => {
            delete FilterQuery[element]
            });
            this.MongooseQuery.find(JSON.parse(JSON.stringify(FilterQuery).replace(/(gt|gte|lt|lte|in|nin|eq|neq)/g, match=>`$${match}`)))
            return this
    }
    sort(){    
            this.MongooseQuery.sort(this.QueryData.sort?.replaceAll("," , ' '))
        return this
    }

    search(){
        if(this.QueryData.search){

            this.MongooseQuery.find({
                $or:[
                    {name:{ $regex : this.QueryData.search ,$options:"i"}},
                    {description:{ $regex :  this.QueryData.search ,$options:"i"}}
                ]
      })
        }

        return this
    }

    select(){
        this.MongooseQuery.select(this.QueryData.fields?.replaceAll("," , ' '))


        return this
    }
}
export default ApiFeatures;