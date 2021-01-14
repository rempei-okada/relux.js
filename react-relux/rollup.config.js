import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from "rollup-plugin-typescript2";
import babel from '@rollup/plugin-babel';

export default [
    {
        input: './src/index.ts',
        output: {
            format: 'esm',
            dir: './build/', // 出力先ディレクトリトップ
            entryFileNames: 'index.js',
            name:"Relux"
        },
        globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
        },
        external:["react","react-dom"],
        plugins: [
            typescript({
                tsconfigOverride: {
                    declaration: true,
                    compilerOptions: {
                        module: "es2015",
                    }
                }
            }),
            babel({
                babelHelpers: 'runtime',
                exclude: 'node_modules/**',
              }),
            nodeResolve({
                browser: true,
                resolveOnly: [
                  /^(?!react$)/,
                  /^(?!react-dom$)/,
                  /^(?!prop-types)/,
                ],
            }),
            commonjs()
        ]
    },
    // {
    //     input: './src/index.ts',
    //     output: {
    //         format: 'cjs',
    //         dir: './dist/', // 出力先ディレクトリトップ
    //         entryFileNames: 'index.js',
    //     },
    //     external: [
    //         'react'
    //     ],
    //     globals: {
    //         "react": "React"
    //     },
    //     plugins: [
    //         typescript({
    //             tsconfigOverride: {
    //                 declaration: true,
    //                 compilerOptions: {
    //                     module: "es2015",
    //                 }
    //             }
    //         }),
    //         nodeResolve(),
    //         commonjs()
    //     ]
    // }
];