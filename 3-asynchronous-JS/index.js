const fs = require('fs');
const superagent = require('superagent');
const { resolve, reject } = require('superagent/lib/request-base');

const readFilePro = file=>{
    return new Promise((resolve,reject)=>{
        fs.readFile(file,(err,data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
}

const writeFilePro = (file,data)=>{
    return new Promise((resolve,reject)=>{
        fs.writeFile(file,data,err=>{
            if(err) reject('Error in writing the file!');
            resolve('Successfully write the file!');
        })
    })
}

readFilePro(`${__dirname}/dog.txt`).then(data=>{
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
    }).then(res=>{
        console.log(res.body.message);
        return writeFilePro('dog-image.txt',res.body.message);
    }).then(()=>{
        console.log("Random dog image saved!");
    }).catch(err=>{
        console.log(err);
    });

// fs.readFile(`${__dirname}/dog.txt`,(err,data)=>{
//     if(err) return console.log(err);
//     console.log(`Breed: ${data}`);

//     superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then(res=>{
//         console.log(res.body.message);

//         fs.writeFile('dog-image.txt',res.body.message,err=>{
//             if(err) return console.log(err);
//             console.log("Random message")
//         })
//     }).catch(err=>{
//         console.log(err);
//     });
// })