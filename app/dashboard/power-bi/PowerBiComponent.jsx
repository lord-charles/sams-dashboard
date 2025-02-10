"use client";
import React, { useEffect, useState } from "react";
import PowerbiEmbedded from "nextjs-powerbi";
// import dynamic from "next/dynamic";
// const PowerbiEmbedded = dynamic(() => import("nextjs-powerbi"));

const PowerBiComponent = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  return (
    <>
      <iframe
        title="sams (1)"
        width="100%"
        height="100%"
        src="https://app.powerbi.com/reportEmbed?reportId=8c7ddb79-a13d-4b99-b2f5-8ffbc6586132&autoAuth=true&ctid=a46229c7-21d1-417d-a1cb-1857a07d2765"
        frameborder="0"
        allowFullScreen="true"
      ></iframe>
      {/* {typeof window !== "undefined" && (
        <PowerbiEmbedded
          id={`${process.env.NEXT_PUBLIC_POWERBI_ID}`}
          embedUrl={`${process.env.NEXT_PUBLIC_POWERBI_EMBED_URL}`}
          accessToken="H4sIAAAAAAAEAC2Xxw60SBKE3-W_shKNh5XmgPfec8ND471Z7btvr2buKVVlVMYXWf_5Y6VPP6XFn3__6XBfnAZ72bJRneyv4g7E_m33FkxAKPccsp9WDOQbD2aI15k42Z4j7EShLA3E8VuiFkWTd7evk7Fmnl5oWTDf4ASYRR3E17aLMssvS2iYGCOhURAOGh_BCZNMYjNmcYe5kISel9t9MnvxdpB2BPV-XyZ9iKl39DxxQAB5v3K5Ejug2hkKIm1dker6RZrn2VQLRlzxqJXnXmS2XQ1OdQXyWmYyJC2CXT-WGE9tSQVA2VXxEUMGqIEL2mWcc81952_8YE8CBTAp4kTKDhXs0-KVZUW29FbOw9KkUkv2eFg5ltn5HgQrPmsM7P6UUpeyywi6thkB9_aO2aqHN3gkXUOg20jivcWMGlV6Yl7U90CelUO0V4Baa_msJd_BE1hjJrd2qiv0ckclicxlaER_8CEqB4DuZaENxL_QRxaQuHrmydaKmNyo40J4NFgunm9iiSNg4wPOYHAL5YeNdFO5jdRag3YqzwsWJVz8HenQggwczoHbp347bdpMz8L1c02NFB83dWSXJMiPfUqOhssNX3yCxVxbqga9KLOy-6RQV-UxE-IoSvaEt2oDkfH3zJtHYGkEnJs0VONWVXJkFYHTrzPmI0-ggw7uPscw9Lhg4rez2wkm6mwIt-8NVwji6AiC47OYm1RB0oqkFKHgYFruTdNnfkgn9cDIlaw5Ev3-ZAu5rC4wkrBsOJGh2tZEPqCOwqZ44cRECUpi4UPbeW2WORM6Rr76LcEmF660b-6oLBc8XCRmyOzHTQLPNxp__Ur3HARzihb61lYRP0GHI4DZufCZvu4YvrBy6RsafImCkzL5SKrAMuclgJmLrkT1ch5pXfnB7HcAjVmqlAfKzsSU7rFle8AJ4iq7Rrv1jivJlRxT_nS_UWs-3TTu_j2eYykaRLvkUWQ8E0HYBwszVYlhqbgyqy195436BLNotMnqYPXFMHD2TSlSm1H56yMnufG0z_AHndIEimjOx6rmdGAEn8zXVg9CRWHEAZjj6Q3irkjET9ThkIr6NXA69M-HzlsX3w2QW4hd50IbczkHbTwHv7I9WYh5SuNB4HUkktzYtCl9QpiPe_e-vIrrFClAzZcSR65uxMBvWlndHbO2cl4e33rjQRrh4aecqihzkvQzigX-IyZx4J6Y0CaEuF9Utq0rqV9rs9_tm7yULFsJrofuVu_uI11KNPSw3SVpSNbY_Nwwu5QxsNRgOoAxNn3JLso_8BDtTU_jPKJLYivHK3YCc_E-PNF-zDvmA49TLhzJvq3bW7GyyDw35YbkWbtysjgToxHu1lPZSvBTlB5X5hUAHxSJ7zB1Ugq8GJa_iw3ifBrmLIL4jukthSyA2xUdWrdaG5kdpNa0yiHNYbGizJrXVwSia1DaOWbgzS30wIlvg-xf0SNHh0CkQJQA8ksS52iJkgS1Hc5yNIZLSVv9KGh7DecMHPcxh1O9WXilZz9JJe53qe-6KDEzoKTGS0uXz-Q-fnKV5Axh0HVUg6eMoPydSxBmnBLqjrg9J7BS5eSLWERjjuFOgvZgzp1QJV20Z_pFA5jaIwmqPnmzYcPJ4mzMYRnSkB3hOUDVizLmYfnW42lS-5ruKOFtWjDpYg8Yj8qxH78iQ2AM2F-o4o2pvdmVtRszQNo0C7VfE-hjCJ8SU8bP2MySPL2RCxXGZXqYoQOQkZ15J7C1Nb9YAsTVTklyNKuCPqrE5Hqmt2tceBHcLTpcrLhpCsGqqXluT7naprEH6jbsXhrHi96adeKGvIzjcm7bjRA8G-95whz98ozdJKuIKqpl2NuIUnxpyQoBVVrYz2LwH7wbFDz8UqybeI_rF6XaI4a6mU4ZowitCxRE6JekGR-TntGnZHaALqLae7DZzkUlSCnpC6GNFV7LFuB0017fMqpU7UNDWZVujzENMHo34SilYVqE7YZeTwiYq-JhWOMP8qoa_DFNclNuwMrkvh2W-PwoKKNCSibjnV42CE9OZpJ__UiUBxk1bJBclWqnFuyVRygDDlpE41z7PLAyvLyBcGPWRVjCaRV7kb8oF3c-T6OnoooGAIkZgyO-ZA0IH-8eXjBZNutH37irVzv6-KqwMSQbmiuGXJSyh3KXAz7OWNiGNLGBSLJS4RSd250Tea15jM7bckVkI5z5poLPO-VwmktWwZpiC5ncHvGfyeV2aPPxBWZ_8BnSMUxkGACA2c3xbvnELTBrj9wIx0uZKzjUo6BW8fdisJJ5cP3gEAMG3ZCBLfdrk9gJnTLYtA4YjPmnI_SfQMcW83Z-G8JR4PH3qJsfCKwOzcqPZ8Ttb8foGVthjNVVZwSYocSLBvwX8OkoWrUygTMPiz4KQmRdgXRdQGbJQDVaEnDaRYpFE7N2pACDy3SwMq38MWXIvD-sli8vmGVhqRB4PLPMILrxUaVfIT8jgxdvxeQFaw5gK57ONzMsYCApBBiUIuPLDVy-Eqi_LuvP_Gd9mInquTbf4_nD2vCLXpfgg5cS8sYoe1Xg0LLETxv56hkAOHz_HNAvTapap_SHubfcYgesd0GmbfY23MZNDdhWaepJAWHuBxNmZyJNOFll9Io6onbCEYBTmbjp_2Yw7L2YlFtdxmdkLaTI-mrWEgEadXRS6b_--vOvP-z6zPukls9vTTRBOprXrzwKy0RdOEHZ3QiL-sGjYljDozNZfWoS-VwVvedxAeihbCsln1WSUUggJh_UrniMDe8t-ChIjXTjeh_QCEgITJBi-FCkvSJftPPbz8Bv3IZpDHGTToZfLn6IDYpIrzyl1Xsd_KJ_Yb2q8foj-l1d7SMvxeDIzdYoKYqN4KgWHimRra8uDyKz4LSNhrMrUnh8yKbi-o7Vn1BaMaiYalDf6k_b2cUek4aZXJLX1z9wHuov-koqz1SDqGy0D5nbFDXW8Vchm1l1JKrjOW5G2HK_yggmVbhUe5mXzeblOHuej10kR1lsjlm_CU1PqLWrtNaG4p3EnUCaQJyyNwvC_0fmZ27KVQ5-KqvTRJ9JIF6eg3eoe0faoLJ_V7ltPab7sZa_soUUduOygoxZrMw8B0L41B_UPntDH_0wrQZlrtVdBZ6NjXqVOB-feijAq2s5VcLpgpxzpO0xTcGEVlxtvkj7xsOpB2U9baF9YiNPZhPHMFkQDfkkakffbBnurZbF0PPXmXPCblsDqfYk2yqh8E5i3XgpQjL9930I6E62aRFIZumrOvBBIMFXtgCZItgaejlPDPfno0Xmt2r19twhP1IjoMrBHWi-casoik4QS24ZG6dIjpjOGryMF7QtFqhF9QGOYpg1gSYQw02in6PtewT-IE5d6Atw3v1brCs7vEFBAPmA6lC6fxoqR5yfjY_lTEFzmbfgCDI9jhlht8UXSUYYa5g8uX4y__d_kpD1tBoNAAA=.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUVVUk9QRS1OT1JUSC1CLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZXhwIjoxNzAwNzQ3Mzg0LCJhbGxvd0FjY2Vzc092ZXJQdWJsaWNJbnRlcm5ldCI6dHJ1ZX0="
          settings={
            {
            }
          }
          width="100%"
          height="100%"
        />
      )} */}
    </>
  );
};

export default PowerBiComponent;
