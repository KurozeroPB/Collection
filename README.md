<div align="center">
    <br />
    <p>
        <a href="https://discord.gg/p895czC">
            <img src="https://discordapp.com/api/guilds/240059867744698368/embed.png" alt="Discord server" />
        </a>
        <a href="https://www.npmjs.com/package/@kurozero/collection">
            <img src="https://img.shields.io/npm/v/@kurozero/collection.svg?maxAge=3600" alt="NPM version" />
        </a>
        <a href="https://www.npmjs.com/package/@kurozero/collection">
            <img src="https://img.shields.io/npm/dt/@kurozero/collection.svg?maxAge=3600" alt="NPM downloads" />
        </a>
        <a href="https://david-dm.org/KurozeroPB/rssemitter">
            <img src="https://img.shields.io/david/kurozeropb/rssemitter.svg?maxAge=3600" alt="Dependencies" />
        </a>
        <a href="https://www.patreon.com/Kurozero">
            <img src="https://img.shields.io/badge/donate-patreon-F96854.svg" alt="Patreon" />
        </a>
    </p>
    <p>
        <a href="https://nodei.co/npm/@kurozero/collection/">
            <img src="https://nodei.co/npm/@kurozero/collection.png?downloads=true&stars=true" alt="NPM info" />
        </a>
    </p>
</div>

# Collection

### Docs
https://kurozeropb.github.io/Collection/


### Installation
`yarn add @kurozero/collection` or `npm i @kurozero/collection`

### Examples
```js
const { Collection } = require("@kurozero/collection");

/* Create a Collection from an existing Object */
const obj = { "foo": "bar", "test": "123", "abc": "def" };
const collection = Collection.from(obj);
console.log(collection);
// Collection {
//     'foo' => 'bar',
//     'test' => '123',
//     'abc' => 'def'
// }
```

<br/><br/>

```js
const { Collection } = require("@kurozero/collection");

/* Create a Collection from an existing Array */
const arr = ["foo", "bar", "baz", "test", "123"];
const collection = Collection.from(arr);
console.log(collection);
// Collection {
//     0 => 'foo',
//     1 => 'bar',
//     2 => 'baz',
//     3 => 'test',
//     4 => '123'
// }
```

<br/><br/>

```js
const { Collection } = require("@kurozero/collection");

class Car {
    constructor(details) {
        this._key = details.name; // _key will be used as the collection key
        this.name = details.name;
        this.brand = details.brand;
    }
}

const cars = new Collection<Car>(Car);
cars.add(new Car({ name: "A6", brand: "Audi" }));
cars.add(new Car({ name: "A1", brand: "Audi" }));
cars.add(new Car({ name: "A3", brand: "Audi" }));
cars.add(new Car({ name: "Polo", brand: "Volkswagen" }));
console.log(cars);
// Collection {
//     "A6" => Car { name: 'A6', brand: 'Audi' },
//     "A1" => Car { name: 'A1', brand: 'Audi' },
//     "A3" => Car { name: 'A3', brand: 'Audi' },
//     "Polo" => Car { name: 'Polo', brand: 'Volkswagen' }
// }

const audis = cars.filter((car) => car.brand === "Audi");
console.log(audis);
// [
//     Car { name: 'A6', brand: 'Audi' },
//     Car { name: 'A1', brand: 'Audi' },
//     Car { name: 'A3', brand: 'Audi' }
// ]
```
