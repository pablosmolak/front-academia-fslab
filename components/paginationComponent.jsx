"use client"

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "./ui/pagination";
import { useEffect, useState } from "react";
import { useSidebar } from "./ui/sidebar";
import { useIsMobile } from "./hooks/use-mobile";

export default function PaginationComponent({ maxPageComponent = 3, totalPages, currentPage, querys, route, wordQueryPage = "pagina" }) {

  const [paginas, setPaginas] = useState([]);

  const isMobile  = useIsMobile();

  const maxPage = isMobile ? 1 : maxPageComponent;

  function paginationFunction(maxPageComponent, currentPage, totalPages) {
    let pages = [];
    let metade = Math.floor(maxPageComponent / 2);
    let pinicio = parseInt(currentPage) - metade;
    let pfim = parseInt(currentPage) + metade;

    if (pinicio <= 0) {
      pfim += 1 - pinicio;
      pinicio = 1;
    }

    if (pfim > totalPages) {
      pinicio += totalPages - pfim;
      pfim = totalPages;
    }

    for (let i = pinicio; i <= pfim; i++) {
      if (i <= 0 || i > totalPages) continue;

      let link = gerarLink(querys, i);

      pages.push({ id: i, page: i, active: Number(currentPage) === i ? true : false, link: link ?? null });
    }

    return pages;
  }

  function gerarLink(querys, page) {
    let link = route;

    if (page) querys = { ...querys, ...{ [wordQueryPage]: page } };

    let newQuerys = new URLSearchParams(querys);

    link = `${link}?${newQuerys.toString()}`

    return link;
  }

  useEffect(() => {
    setPaginas(paginationFunction(maxPage, currentPage, totalPages));
  }, [querys, currentPage, totalPages, maxPage]);


  function encontrarNumero(numero) {
    if (paginas.find(n => Number(n.page) === numero)) return true;

    return false;
  }

  return (
    <Pagination className={"m-4"}>
      <PaginationContent >

        <PaginationItem>
          <PaginationPrevious
            data-test="button-pagina-anterior"
            title={"Ir para página anterior"}
            href={gerarLink(querys, currentPage - 1)}
            aria-disabled={Number(currentPage) === 1}
            className={Number(currentPage) === 1 ? "pointer-events-none opacity-50" : undefined}
          >{!isMobile ? "Anterior" : ""}</PaginationPrevious>
        </PaginationItem>

        {!encontrarNumero(1) && (
          <PaginationItem>
            <PaginationLink data-test={"primeira-pagina"} href={gerarLink(querys, 1)} title={"Ir para página 1"}>
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {(!encontrarNumero(1) && (currentPage - 1 >= maxPageComponent)) && (
          <PaginationEllipsis />
        )}

        {paginas?.map((pagina) => (
          <PaginationItem key={pagina?.id}>
            <PaginationLink data-test={`pagina-${pagina}`} isActive={pagina.active} href={pagina?.link} title={`Ir para página ${pagina?.page}`}>
              {pagina?.page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {(!encontrarNumero(totalPages) && (totalPages - currentPage >= maxPageComponent)) && (
          <PaginationEllipsis />
        )}

        {!encontrarNumero(totalPages) && (
          <PaginationItem>
            <PaginationLink data-test={`ultima-pagina`} href={gerarLink(querys, totalPages)} title={`Ir para página ${totalPages}`}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            title={"Ir para próxima página"}
            data-test="button-proxima-pagina"
            href={gerarLink(querys, currentPage + 1)}
            aria-disabled={Number(currentPage) === totalPages}
            className={Number(currentPage) === totalPages ? "pointer-events-none opacity-50" : undefined}
          >{!isMobile ? "Próximo" : ""}</PaginationNext>
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  )
}