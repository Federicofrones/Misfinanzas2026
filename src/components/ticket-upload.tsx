"use client"

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface TicketUploadProps {
    onUploadSuccess: (url: string) => void;
}

export function TicketUpload({ onUploadSuccess }: TicketUploadProps) {
    return (
        <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={(result) => {
                if (typeof result.info !== 'string' && result.info?.secure_url) {
                    onUploadSuccess(result.info.secure_url);
                    toast.success("Ticket subido correctamente");
                }
            }}
            onError={() => {
                toast.error("Error al subir el ticket");
            }}
        >
            {({ open }) => {
                return (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2 border-dashed border-2 h-20 bg-secondary/20 hover:bg-secondary/40"
                        onClick={() => open()}
                    >
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        <span className="text-muted-foreground">Subir comprobante / ticket</span>
                    </Button>
                );
            }}
        </CldUploadWidget>
    );
}
