export const add = (modulo)=>(a,b) => (a + b)%modulo;
export const diff = (modulo)=>(a,b) => (a - b + modulo)%modulo;
export const isBetween = (modulo)=>(a,b) => (x) => (a<b)? (x < b && x >= a): !isBetween(modulo)(b,a)(x);

describe('opening hours', () => {
  it('add without wrap', () => {
    const result = add(10)(1,2);
    expect(result).toEqual(3);
  })

  it('add with wrap', () => {
    const result = add(10)(8,3);
    expect(result).toEqual(1);
  })

  it('diff without wrap', () => {
    const result = diff(10)(8,2);
    expect(result).toEqual(6)
  })

  it('diff with wrap', () => {
    const result = diff(10)(2,5);
    expect(result).toEqual(7)
  })

  it('isBetween', () => {
    expect(isBetween(10)(3,7)(4)).toEqual(true);
    expect(isBetween(10)(3,7)(8)).toEqual(false);

    expect(isBetween(10)(3,7)(3)).toEqual(true);
    expect(isBetween(10)(3,7)(7)).toEqual(false);


    expect(isBetween(10)(8,2)(1)).toEqual(true);
    expect(isBetween(10)(8,2)(3)).toEqual(false);

    expect(isBetween(10)(8,2)(8)).toEqual(true);
    expect(isBetween(10)(8,2)(2)).toEqual(false);
  })
})
