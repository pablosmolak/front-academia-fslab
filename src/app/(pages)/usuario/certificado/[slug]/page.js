import Image from 'next/image';

export default function CertificadoPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Certificado</h1>
      <div className="shadow-lg rounded-lg overflow-hidden">
        <Image 
          src="/certificado.jpg" 
          alt="Certificado" 
          width={800} 
          height={600} 
          priority={true} 
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
