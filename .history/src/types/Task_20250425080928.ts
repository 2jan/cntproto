export interface Task<data, result> {
    runAsync(data: data): Promise<result>
    map<result2>(f: (o: result) => result2): Task<data, result2>
    then<result2>(f: Task<result, result2>): Task<data, result2>
}