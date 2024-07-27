export default function Home() {
  return (
    <div className="App">
      <nav className="mt-0 w-full bg-gray-800 p-2">
        <div className="container mx-auto flex flex-wrap items-center">
          <div className="flex w-full justify-center font-extrabold text-white md:w-1/2 md:justify-start">
            <a className="text-white no-underline hover:text-white hover:no-underline" href="#">
              <span className="pl-2 text-2xl">Flowbite Navbar</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-10">
        <div className="flex justify-center">
          <button
            type="button"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
          >
            Button
          </button>
        </div>
      </div>
    </div>
  )
}
