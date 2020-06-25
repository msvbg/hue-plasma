import got from 'got';
import { readFileSync } from 'fs';
import _ from 'lodash';

const hueIp = '192.168.10.221';
const username = readFileSync('./username', 'utf8');

const getLights = async () => {
    const response = await got(`http://${hueIp}/api/${username}/lights`);
    return JSON.parse(response.body);
}

interface Light {
    id: string,
    state: {
        reachable: boolean,
        bri: number,
        sat: number,
        hue: number
    }
}

const getFrame = (allColors, time) => {
    return allColors.map((colors, i) => {
        const [h, s, v] = colors;
        return [(h + time * 2000 * (1 + Math.log(i + 1))) % (2 ** 16), s, v];
    })
}

const update = (lights: Light[], colors) => {
    lights.forEach((light, i) => {
        got.put(`http://${hueIp}/api/${username}/lights/${light.id}/state`, {
            body: JSON.stringify({
                hue: colors[i][0],
                sat: colors[i][1],
                bri: colors[i][2]
            })
        }).then(x => {
            console.log(x.body)
        })
    })
}

const main = async () => {
    const lights: Light[] = _.map(await getLights(), (val, key) => ({ id: key, ...val }))
        .filter(light => light.state.reachable);
    let time = 0;
    console.log(lights);

    while (true) {
        time += 1;

        const colors = lights.map(light => [light.state.hue, light.state.sat, light.state.bri]);
        const newColors = getFrame(colors, time);
        update(lights, newColors);

        await sleep(400);
    }
}

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

main();

export { }