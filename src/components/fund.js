import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { FcMoneyTransfer } from "react-icons/fc";
const Fund = () => {
  return (
    <div className="dashboard-body-divs fund">
      <div className="fund-data">
        <div className="fund-data-heading fund-common">
          <HiOutlineCurrencyRupee className="fund-data-logo" />
          <span className="fund-data-heading-html">Fund Available:</span>
        </div>
        <div className="fund-data-value fund-common">&#8377; 0.00</div>
        <div className="fund-common">
          <button className="fund-data-add">+Add Funds</button>
        </div>
      </div>
      <div className="fund-logo">
        <FcMoneyTransfer />
      </div>
    </div>
  );
};

export default Fund;
