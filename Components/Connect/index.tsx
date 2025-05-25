import Arweave from "../../Image/Arweave";
import Metamask from "../../Image/Metamask";
import Wander from "../../Image/Wander";
import { arweave, metamask, wander } from "../../utils/wallet";

const Connect = () => {
  return <div>
    <div className="flex items-center justify-center gap-2 text-white">
      <div className="flex gap-2 border-2 rounded-md p-2  bg-black" onClick={() => wander()}>
        <div className="w-6 h-6 items-center justify-center flex">
          <Wander />
        </div>
        <button>Wander</button>
      </div>
      <div className="flex gap-2 border-2 rounded-md p-2 bg-black" onClick={() => metamask()}>
        <div className="w-6 h-6">
          <Metamask />
        </div>
        <button>Metamask</button>
      </div>
      <div className="flex gap-2 border-2 rounded-md p-2 bg-black" onClick={() => arweave()}>
        <div className="w-6 h-6">
          <Arweave theme="dark" />
        </div>
        <button>Arweave.app</button>
      </div>
    </div>
  </div>
}
export default Connect; 
