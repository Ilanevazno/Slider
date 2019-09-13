import {expect} from "chai";

function pow(){
    return 8;
}

describe("pow", () => {
    it("Возводит в n-ую степень", () => {
        assert.equal(pow(2, 3), 8);
    })
})
