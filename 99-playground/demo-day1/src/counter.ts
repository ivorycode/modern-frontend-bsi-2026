import chalk from 'chalk'

export function setupCounter(element: HTMLButtonElement) {
  // Jonas was here!!!!
  let counter:number = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `Count is ${counter}`
  }
  element.addEventListener('click', () => {
    setCounter(counter + 1)
    console.log(chalk.green.bold('Counter increased to ') + chalk.yellow(counter))
  })
  setCounter(0)
}
