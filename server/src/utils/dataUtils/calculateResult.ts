type Result = {
    result: string,
    minScore: number,
    maxScore: number,
}

export default function calculateResult(results: Result[], score: number) {
    let computedResult = '';
    for (let i = 0; i < results.length; i++) {
        const res = results[i];
        if (score >= res.minScore && score <= res.maxScore) {
            computedResult = res.result;
            break;
        }
    }
    return computedResult;
}