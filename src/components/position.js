import { FcMoneyTransfer } from "react-icons/fc";
import { LuArrowDownUp } from "react-icons/lu";
const Position = () => {
  return (
    <div className="dashboard-body-divs position">
      <div className="position-data">
        <div className="position-data-heading position-common">
          <LuArrowDownUp className="position-data-logo" />
          <span className="position-data-heading-html">Positions</span>
        </div>
        <div className="position-data-value position-common">
          You don't have any position for today
        </div>
        <div className="position-common position-data-add">Invest Now</div>
      </div>
      <div className="position-logo">
        <FcMoneyTransfer />
      </div>
    </div>
  );
};

export default Position;
