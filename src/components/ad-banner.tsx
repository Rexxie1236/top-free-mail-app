import Image from 'next/image';

export function AdBanner() {
  return (
    <div className="my-8 md:my-12 flex justify-center">
      <div className="w-full max-w-4xl p-4 bg-muted/30 rounded-lg flex justify-center items-center">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          <Image
            src="https://picsum.photos/728/90"
            width={728}
            height={90}
            alt="Advertisement"
            className="mx-auto"
            data-ai-hint="advertisement banner"
          />
        </a>
      </div>
    </div>
  );
}
