import { component$ } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";

type Country = {
  name: string;
  numImages: Number;
};

const countries: Country[] = [
  {
    name: "Kenya",
    numImages: 5,
  },
];

export default component$(() => {
  return (
    <div>
      {countries.map((country, i) => (
        <div key={i}>
          <div class="text-3xl">{country.name}</div>
          <div class="grid grid-cols-3 gap-y-5">
            {new Array(country.numImages).fill(0).map((_, i) => (
              <div key={i}>
                <Image
                  src={`/images/follow/${country.name.toLowerCase()}${
                    i + 1
                  }.webp`}
                  layout="constrained"
                  width={400}
                  height={250}
                  alt={`Follow car for ${country.name}`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});
