const express = require('express');
const cluster = require('cluster');
const os = require('os');
const port = 4001;


const factorial = (n, memo = {}) => {
    if (n < 0) return -1; 
    if (n === 0) return 1;

    if (memo[n]) {
        return memo[n];
    }

    memo[n] = n * factorial(n - 1, memo); 
    return memo[n];
};


const numCPUs = os.cpus().length;

// if (cluster.isMaster) {
//   console.log(`Master process ${process.pid} is running`);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker process ${worker.process.pid} died. Restarting...`);
//     cluster.fork();
//   });
// } else {
    const app = express();

    app.get('/factorial/:number', (req, res) => {
        const number = parseInt(req.params.number);

        if (isNaN(number)) {
            return res.status(400).send({ error: 'Invalid number' });
        }

        const result = factorial(number);

        if (result === -1) {
            return res.status(400).send({ error: 'Factorial of a negative number is not defined' });
        }

        res.send({ number, factorial: result });
    });

    // Start the server
    app.listen(port, () => {
        console.log(`Factorial API listening at http://localhost:${port}`);
    });
// }


