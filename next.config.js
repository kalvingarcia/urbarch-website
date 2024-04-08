/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'app/assets/styles')]
    }
};

module.exports = nextConfig;
