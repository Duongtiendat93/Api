import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoBack from "../Molecules/GoBack";

function Billing({amounts,id}) {
  // const location = useLocation();
  // const amounts = location.state.amount.amount;
  // const id = location.state.id;
  console.log("---->",amounts)
  const [fee, setFee] = useState(1500);
  const [money, setMoney] = useState(fee + +amounts);
  const [user, setUser] = useState([]);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const wallet = user.amount;
  const totalWallet = +wallet - money;
  const URL = "https://628b0319667aea3a3e259443.mockapi.io/api/v1/bank_accounts";

  const date = new Date();
  const today =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  const time =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  useEffect(() => {
    const getDetailUser = async () => {
      const res = await axios.get(`${URL}/${id}`);
      setUser(res.data);
    };
    getDetailUser();
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();

    if(amounts % 50 !== 0){
      alert("the amount must be divisible by 50")
    }else{
      const updateListUser = async () => {
        const res = await axios.put(`${URL}/${id}`, {
          amount: totalWallet,
        });
        return res.data;
      };
  
      updateListUser().then((abc) => {
        setUser(abc);
        alert(` you withdrewed ${money}`);
      });
  
      const createTranstion = async () => {
        const res = await axios.post(
          `https://628b0319667aea3a3e259443.mockapi.io/api/v1/bank_accounts/1/withdraws`,
          {
            accountNumber: user.accountNumber,
            amount: user.amount,
            ternimal_fee:fee,
            requsted_amount:amounts,
            createdAt:{date} 
          }
        );
        console.log("===>", res);
        return res.data;
      };
      createTranstion().then((abc) => setHistory([...history, abc]));
    }

  };

  return (
    <>
      <div className="bill_container">
        <div>ATM TRANSACTION - Wallet {user.amount}</div>
        <p className="bill_container_text">DATE : {today} - {time}</p>
        <p className="bill_container_text">REQUSTED AMOUNT : {amounts} </p>
        <p className="bill_container_text">TERNIMAL FEE : {fee} </p>
        <p className="bill_container_text">TOTAL AMOUNT :{money} </p>
        <button className="btn" onClick={(e) => handleUpdate(e)}> approve </button>

        <table className="bill_container_table">
          <tr>
            <th>Date</th>
            <th>accountNumber</th>
            <th>Requested amount</th>
            <th>ternminal fee</th>
            <th>Wallet </th>
          </tr>
          {history.map((historys, index) => 
          (
            <tr key={index}>
              <td>{historys.createdAt}</td>
              <td>{historys.accountNumber}</td>
              <td>{amounts}</td>
              <td>{fee}</td>
              <td>{historys.amount}</td>
            </tr>
          ))}
        </table>

      </div>

      <GoBack />

    </>
  );
}

export default Billing;
