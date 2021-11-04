function Test() {
    const obj = {
        name: "Uni"
    }

    const fetchFun = async () => {
        obj.age = await handleData();
    }

    fetchFun();

    return obj;
}


function handleData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(21);
        }, 3000);
    })
}

const res = Test();
console.log(res);