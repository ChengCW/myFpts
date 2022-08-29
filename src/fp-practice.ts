import { flow, pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import * as TO from 'fp-ts-contrib/lib/TaskOption';
import * as TE from 'fp-ts/lib/TaskEither'
import axios, { AxiosResponse } from 'axios'
import { string } from "fp-ts";
import { reduceWithIndex } from "fp-ts/lib/FoldableWithIndex";
import * as M from 'fp-ts/lib/Map'
import * as S from 'fp-ts/lib/string'
// const B: Map<string, string> = new Map()

// B.set('123', '200');
// B.set('456', '456');
// type CreateUser = (st: string) => Promise<E.Either<Error, AxiosResponse>>
// const createUser: CreateUser = (st) => {
//     // ...
//     return axios.get(`https://httpstat.us/${st}`)
//         .then(res => E.right(res))
//         .catch(error => {
//             // change to your custom error
//             console.error(error);
//             return E.left(error)
//         })
// }

// (async () => {
//     const res = await pipe(
//         B,
//         E.fromNullable(() => 'error'),
//         E.map(b => b.get('456')),
//         // //O.fromNullable
//         E.chain(
//             flow(
//                 E.fromNullable(() => 'error'),
//             )
//         )

//         //flow(createUser)

//     )

//     console.log(res)
//     // if (res._tag !== 'None') {
//     //     const final = await createUser(res.value)
//     //     console.log(final)
//     // }

// })()


// const arr: number[] = [];
// const safeFirstElement: O.Option<number> = A.head(arr);

// const firstElementDouble = pipe(
//     safeFirstElement,
//     O.map(value => value * 2)
// );

// console.log(firstElementDouble);

// const f1 = (input: string): O.Option<string> => {
//     return O.some(input + " f1")
// };
// const f2 = (input: string): TO.TaskOption<string> => async () => {
//     return O.some(input + " f2")
// };
// const f3 = (input: string): O.Option<string> => {
//     return O.some(input + " f3");
// };

// const abc = pipe(
//     "X",
//     flow(f1, TO.fromOption),
//     TO.chain(f2),
//     TO.chain(flow(f3, TO.fromOption)),
// )
// abc().then(console.log)

// const flattenTest = pipe(
//     O.some(2),

//     //O.fromNullable
//     O.chain(
//         flow(
//             O.fromNullable
//         )
//     )


// );

// console.log(flattenTest)

// //------------------------------------------------------------------
// const doubleIfEvenElseNone = (n: number) => n % 2 === 0
//     ? O.some(2 * n)
//     : O.none

// const increaseIfEven = (n: number) => n % 2 === 0
//     ? O.some(n + 1)
//     : O.some(n)

// const optionEven = O.some(2);
// const optionOdd = O.some(3);

// const a = O.chain(doubleIfEvenElseNone)(optionEven) // O.some(4)
// console.log(a)

// const odd = pipe(
//     optionEven,
//     O.chain(doubleIfEvenElseNone)

// ) // O.none

// console.log(odd);

// const even = pipe(
//     optionEven,
//     O.map(doubleIfEvenElseNone), // O.some(O.some(4))
// );
// console.log(even);

// const evenFlattened = pipe(
//     optionEven,
//     O.map(doubleIfEvenElseNone), // O.some(O.some(4))
//     O.flatten // O.some(4)
// );

// console.log(evenFlattened);

// const even2 = pipe(
//     optionOdd,
//     O.chain(doubleIfEvenElseNone),
//     O.chain(increaseIfEven)
// ) // O.none

// console.log(even2);

// //--------------------------------------



// //import * as Option from "fp-ts/lib/Option";

// const res = pipe(
//     O.some(1),
//     O.map(n => n * 2),
//     O.chain(n => (n === 0 ? O.none : O.some(1 / n))),
//     O.filter(n => n < 1),
//     O.fold(
//         () => "ko",
//         () => "ok"
//     )
// );
// console.log(res)


// const arr1: number[] = [2];
// const safeFirstElement1: O.Option<number> = A.head(arr1);

// const firstElementTimesTwo = pipe(
//     safeFirstElement1,
//     O.map(value => value * 2),
//     //O.map(n => (n === 0 ? O.none : O.some(1 / n)))
// );

// const firstElementTimesTwoDividedByZero = pipe(
//     firstElementTimesTwo,
//     // O.map(n => (n === 0 ? O.none : O.some(1 / n)))
//     O.chain(n => (n === 0 ? O.none : O.some(1 / n)))
// );

// const firstElementTimesTwoDividedByZeroGreaterThanOne = pipe(
//     firstElementTimesTwoDividedByZero,
//     O.filter(n => n > 1)
// );
// console.log(firstElementTimesTwoDividedByZeroGreaterThanOne)

// function ComputeWithFpts(array: number[]): string {
//     return pipe(
//         A.head(array),
//         O.map(n => n * 2),
//         O.chain(n => (n === 0 ? O.none : O.some(1 / n))),
//         O.filter(n => n > 1),
//         O.fold(
//             () => "ko",
//             (result) => `the result is: ${result}`
//         )
//     );
// }

// console.log(ComputeWithFpts([0.25]));

// type Box = BlueBox | RedBox;

// type BlueBox = {
//     t: "Blue";
//     v: string;
// };
// type RedBox = {
//     t: "Red";
//     v: number;
// };

// // this are typesafe
// const parseBlueBox = (box: Box): O.Option<BlueBox> =>
//     box.t === "Blue" ? O.some(box) : O.none;
// const parseRedBox = (box: Box): O.Option<RedBox> =>
//     box.t === "Red" ? O.some(box) : O.none;

// const isBlueBox = parseBlueBox;
// const isRedBox = parseRedBox;

// const boxes: Array<Box> = [{
//     t: "Red",
//     v: 123
// },{t:"Blue",v:'111111'}]

// const onlyBlueBoxes = pipe(boxes,A.filterMap(parseBlueBox))
// const blueBox=A.filterMap(parseBlueBox)(boxes)
// console.log(blueBox)

//
// const a: string | undefined = undefined;
// const b: string | undefined = "Present";

// const result1 = a || b; // "Present"
// const result2 = pipe(
//   O.fromNullable(a),
//   O.alt(() => O.fromNullable(b))
// );
// console.log(result2)
//

const a: string | undefined = undefined;
const d: string | undefined = undefined; // always present

// keep the option
const result3 = pipe(
    O.fromNullable(a),
    O.alt(() => O.some(d))
);
// O.some("Default")

// exiting the option
const result4 = pipe(
    O.fromNullable(a),
    O.getOrElse(() => d)
);

console.log(result4)


let m = new Map<string, number>([['123', 123], ['456', 456]])
//const keys = M.keys(S.Ord)(m)
//console.log(keys)


const getAvailableValueOrNull = pipe(
    m,
    O.fromNullable,
    O.map(x => M.keys(S.Ord)(x)),
    //M.keys(S.Ord)(m),
    O.chain(A.head),
    O.map(x => m.get(x)),
)

const getAvailableSeqConnOrNull = pipe(
    M.keys(S.Ord)(m),
    A.head,
    O.map(x => m.get(x)),
)

const getabc = pipe(
    m.get('123'),
    TE.fromNullable(Error),
    TE.map(x => x)
)
console.log(getabc)

import { apply as AP /* and others above */ } from "fp-ts";
import * as T /* and others above */ from "fp-ts/lib/Task";
// Here, TaskEither result can be number | boolean (success case), string on error
const arrayofTE = [TE.right(1), TE.right(true), TE.left("Oh shit")] as const;

// const run = pipe(
//     AP.sequenceT(T.)(...arrayofTE), // we use sequenceT here and pass T.task again
//     mergeFns
// );

// declare function mergeFn(a: T.Task<E.Either<string, number | boolean>[]>): T.Task<Results>




