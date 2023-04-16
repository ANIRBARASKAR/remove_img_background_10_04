import React,{useState} from 'react'
import axios from "axios"
export default function   Shubh () {


  const [finalData, setfinalData] = useState([])
    
    const test = async () => {
          
      const {data} = await  axios.get('https://api.postman.com/collections/24582109-37d97559-22b0-42e0-b592-7fd8b90b8e01?access_key=PMAT-01GXAEX88FNRZN45AWACQ2V20F')

    console.log("data",data);
    console.log("data.collection",data.collection.item[0].request.url.raw);

    const jira = data.collection.item[0].request.url.raw
    //  in this jira => https://fakestoreapi.com/products
    console.log("jira",jira);

    const anir = async () => {
               const {data} = await axios.get(jira)
               console.log("lara data",data);
               setfinalData(data)
    }
    anir()

   
    const postData = async () => {
      const {data} = await axios.post(jira,{name:"anir"})
      console.log("postData data",data);
    }
    postData()

    }
test()




  return (
    <div>Shubh
    
    
  <div className="container">
    <div className="row">
      <div className="col-sm-12 ">
      <table class="table table-dark table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Product Title</th>
          <th scope="col">Product Price</th>
          <th scope="col">Product Description</th>
          <th scope="col">Product Category</th>
          <th scope="col">Action </th>
        </tr>
      </thead>
      <tbody>


      {
        finalData.map((item,i) => <tr>
          <th scope="row">{i+1}</th>
          <td>{item.title}</td>
          <td>{item.price}</td>
          <td>{item.description}</td>
          <td>{item.category}</td>
          <td>{}</td>
        </tr>
        )
      }
        
       
      </tbody>
    </table>
      </div>
    </div>
  </div>
    
    </div>
  )
}
