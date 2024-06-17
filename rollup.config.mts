import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };
import postcss from 'rollup-plugin-postcss';

/**
* Comment with library information to be appended in the generated bundles.
*/
const banner = `/**
* ${pkg.name} ${pkg.version}
* (c) ${pkg.author.name} ${pkg.author.email}
* Released under the ${pkg.license} License.
*/
`.trim();

const options: RollupOptions[] = [
    {
        input: './src/index.ts',
        output: [
            /*
            {
                banner,
                dir: './dist/esm',
                format: 'esm',
                sourcemap: true
            },
            {
                dir: './dist/esm',
                format: 'esm',
                sourcemap: true,
                plugins: [terser()]
            },
            */
            {
                banner,
                dir: './dist/system',
                format: 'system',
                sourcemap: true
            },
            {
                dir: './dist/system',
                format: 'system',
                sourcemap: true,
                plugins: [terser()]
            },
            /*
            {
                banner,
                dir: './dist/commonjs',
                format: 'commonjs',
                sourcemap: true
            },
            */
        ],
        plugins: [
            // Allows us to consume libraries that are CommonJS.
            commonjs(),
            postcss(),
            resolve(),
            typescript({ tsconfig: './tsconfig.json' })
        ]
    },
    // Bundle the generated ESM type definitions.
    {
        input: './dist/system/src/index.d.ts',
        output: [{ file: './dist/index.d.ts', format: "esm" }],
        plugins: [dts()]
    }
];

export default options;
