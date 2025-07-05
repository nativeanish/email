import { dryrun } from "@permaweb/aoconnect";
import {process} from "../../constants";
export default async function dryRun(tags: Array<{name:string,value:string}> ){
    tags.push({name:"Action",value:"Evaluate"})
    const mssage = await dryrun({
        process: process,
        tags: tags
    })
   return mssage
}