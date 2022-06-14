import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoBack from "../../components/Button/GoBack";
import { useDispatch, useSelector } from "react-redux";
import { updatebalance } from "../../store/reducers/balance";
import { getUser, selectUser } from "../../store/reducerUser/user";
import { updateUser } from "../../store/reducerUser/user";

function Billing({ amounts, id }) {
  const RemainingAmount = useSelector(selectUser);
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  const [history, setHistory] = useState([]);
  const [isToggle, isSetToggle] = useState(false);
  const navigate = useNavigate();
  const wallet = RemainingAmount.amount;
  const totalWallet = +wallet - +amounts;
  const date = new Date();
  const URL =
    "https://628b0319667aea3a3e259443.mockapi.io/api/v1/bank_accounts";

  const today =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  const time =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  useEffect(() => {
    dispatch(getUser(id));
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();

    if (amounts % 50 !== 0) {
      alert(
        "transaction failed because money not enought in wallet and the amount must be divisible by 50"
      );
    } else {
      const updateListUser = async () => {
        const res = await axios.put(`${URL}/${id}`, {
          amount: totalWallet,
        });
        dispatch(updatebalance(res.data.amount));
        return res.data;
      };

      updateListUser().then((abc) => {
        setUser(abc);
      });

      const createTranstion = async () => {
        const res = await axios.post(
          `https://628b0319667aea3a3e259443.mockapi.io/api/v1/bank_accounts/1/withdraws`,
          {
            accountNumber: user.accountNumber,
            amount: user.amount,
            requsted_amount: amounts,
            createdAt: { date },
          }
        );
        return res.data;

      };

      createTranstion().then((abc) => setHistory([...history, abc]));
      isSetToggle(true);
    }
  };

  const Continue = () => {
    isSetToggle(false);
    navigate(-1);
  };

  const Succeed = () => {
    isSetToggle(false);
    navigate(-2);
  };

  return (
    <>
      {isToggle === false ? (
        <>
          <div className="bill_container uppercase ">
            <p className="bill_container_text">Bill</p>
            <p className="bill_container_text">
              ATM transaction - Wallet : <span>{RemainingAmount.amount}$</span>
            </p>
            <p className="bill_container_text">
              Requsted amount : <span>{amounts}$</span>{" "}
            </p>
            <p className="bill_container_text">
              Remaining amount : <span>{totalWallet}$</span>{" "}
            </p>
            <button
              className="btn  btn_effect"
              onClick={(e) => handleUpdate(e)}
            >
              {" "}
              APPROVE{" "}
            </button>
          </div>

          <GoBack />
        </>
      ) : (
        <div className="BillingInfor uppercase">
          <h2>Successful transaction</h2>
          <h3>Thank you for using our service</h3>
          <h3>Do you want to continue making other transactions?</h3>
          <div>
            <input
              type="button"
              value={"ENTER"}
              className="Withdrawal_button_other Withdrawl_btn_confirm  btn_effect"
              onClick={() => Continue()}
            />
            <input
              type="button"
              value={"CENCAL"}
              className="Withdrawal_button_other  Withdrawl_btn_cancel  btn_effect"
              onClick={() => Succeed()}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Billing;
