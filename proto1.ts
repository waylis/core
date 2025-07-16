enum DataType {
    text = 1,
    int,
    float,
    boolean,
    html,
}

type Data =
    | { type: DataType.text; body: string }
    | { type: DataType.int; body: number }
    | { type: DataType.float; body: number }
    | { type: DataType.boolean; body: boolean }
    | { type: DataType.html; body: string };

type DataBodyMap = {
    [DataType.text]: string;
    [DataType.int]: number;
    [DataType.float]: number;
    [DataType.boolean]: boolean;
    [DataType.html]: string;
};

const handle = <T extends DataType>(type: T, call: (body: DataBodyMap[T]) => void) => {
    call;
};

handle(4, (body) => {
    console.log(body);
});
