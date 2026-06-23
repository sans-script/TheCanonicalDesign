"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { guardsService } from "@/services/guards.service";
import { getOrigin } from "@/lib/public-url";

interface AuthenticatedImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

export function AuthenticatedImage({
  src,
  alt,
  className,
  ...props
}: AuthenticatedImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setImgSrc(null);
    setLoaded(false);
    setError(false);

    if (!src) return;

    if (src.startsWith("data:") || !src.startsWith("/uploads")) {
      setImgSrc(src);
      return;
    }

    if (src.includes("?sig=")) {
      setImgSrc(`${getOrigin()}${src}`);
      return;
    }

    let isMounted = true;

    const fetchSignedUrl = async () => {
      try {
        const signedUrl = await guardsService.getSignedUrl(src);
        if (isMounted) {
          setImgSrc(`${getOrigin()}${signedUrl}`);
        }
      } catch {
        if (isMounted) {
          setError(true);
        }
      }
    };

    fetchSignedUrl();

    return () => {
      isMounted = false;
    };
  }, [src]);

  if (error) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/placeholder.png"
        alt={alt}
        className={className}
        style={{
          ...(props.fill ? { position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0 } : {}),
          ...(props.style ?? {}),
        }}
      />
    );
  }

  if (!imgSrc) {
    const isUpload = src.startsWith("/uploads");
    if (isUpload) {
      return (
        <div
          className={`bg-slate-200 animate-pulse ${className ?? ""}`}
          style={{
            ...(props.fill ? { position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0 } : { width: props.width, height: props.height }),
          }}
          aria-hidden="true"
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/placeholder.png"
        alt={alt}
        className={className}
        style={{
          ...(props.fill ? { position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0 } : {}),
          ...(props.style ?? {}),
        }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={{
        ...(props.fill ? { position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, objectFit: "cover" } : {}),
        ...(props.style ?? {}),
      }}
    />
  );
}
