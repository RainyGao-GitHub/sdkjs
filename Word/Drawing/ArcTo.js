/*
 *
 * (c) Copyright Ascensio System Limited 2010-2016
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7  3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7  3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/
"use strict";

var ArcToCurvers = null;
var ArcToOnCanvas = null;
var HitToArc = null;
(function(){
    // arcTo new version
    function Arc3(ctx, fX, fY, fWidth, fHeight, fStartAngle, fSweepAngle)
    {
        var sin1 = Math.sin(fStartAngle);
        var cos1 = Math.cos(fStartAngle);

        var __x = cos1 / fWidth;
        var __y = sin1 / fHeight;
        var l = 1 / Math.sqrt(__x * __x + __y * __y);

        var cx = fX - l * cos1;
        var cy = fY - l * sin1;

        Arc2(ctx, cx - fWidth, cy - fHeight, 2 * fWidth, 2 * fHeight, fStartAngle, fSweepAngle);
    }

    function Arc2(ctx, fX, fY, fWidth, fHeight, fStartAngle, fSweepAngle)
    {
        if (0 >= fWidth || 0 >= fHeight)
            return;

        fStartAngle = -fStartAngle;
        fSweepAngle = -fSweepAngle;

        if (false /*is path closed*/ )
        {
            var fStartX = fX + fWidth / 2.0 + fWidth / 2 * Math.cos( AngToEllPrm( fStartAngle, fWidth / 2, fHeight / 2 ) );
            var fStartY = fY + fHeight / 2.0 - fHeight / 2 * Math.sin( AngToEllPrm ( fStartAngle, fWidth / 2, fHeight / 2 ) );

            if ( fSweepAngle < (2 * Math.PI) )
            {
                ctx._m(fStartX, fStartY);
            }
        }

        var bClockDirection = false;
        var fEndAngle = (2 * Math.PI) -(fSweepAngle + fStartAngle);
        var fSrtAngle = (2 * Math.PI) - fStartAngle;
        if( fSweepAngle > 0 )
            bClockDirection = true;

        if(Math.abs(fSweepAngle) >= (2 * Math.PI))
        {
            Ellipse(ctx, fX + fWidth / 2, fY + fHeight / 2, fWidth / 2, fHeight / 2);
        }
        else
        {
            EllipseArc(ctx, fX + fWidth / 2, fY + fHeight / 2, fWidth / 2, fHeight / 2, fSrtAngle, fEndAngle, bClockDirection);
        }
    }

    function AngToEllPrm(fAngle, fXRad, fYRad)
    {
        return Math.atan2( Math.sin( fAngle ) / fYRad,  Math.cos( fAngle ) / fXRad );
    }

    function Ellipse(ctx, fX, fY, fXRad, fYRad)
    {
        ctx._m(fX - fXRad, fY);

        var c_fKappa = 0.552;
        ctx._c(fX - fXRad, fY + fYRad * c_fKappa, fX - fXRad * c_fKappa, fY + fYRad, fX, fY + fYRad);
        ctx._c(fX + fXRad * c_fKappa, fY + fYRad, fX + fXRad, fY + fYRad * c_fKappa, fX + fXRad, fY);
        ctx._c(fX + fXRad, fY - fYRad * c_fKappa, fX + fXRad * c_fKappa, fY - fYRad, fX, fY - fYRad);
        ctx._c(fX - fXRad * c_fKappa, fY - fYRad, fX - fXRad, fY - fYRad * c_fKappa, fX - fXRad, fY);
    }

    function EllipseArc(ctx, fX, fY, fXRad, fYRad, fAngle1, fAngle2, bClockDirection)
    {
        while ( fAngle1 < 0 )
            fAngle1 += (2 * Math.PI);

        while ( fAngle1 > (2 * Math.PI) )
            fAngle1 -= (2 * Math.PI);

        while ( fAngle2 < 0 )
            fAngle2 += (2 * Math.PI);

        while ( fAngle2 >= (2 * Math.PI) )
            fAngle2 -= (2 * Math.PI);

        if ( !bClockDirection )
        {
            if ( fAngle1 <= fAngle2 )
                EllipseArc2(ctx, fX, fY, fXRad, fYRad, fAngle1, fAngle2, false);
            else
            {
                EllipseArc2(ctx, fX, fY, fXRad, fYRad, fAngle1, 2 * Math.PI, false);
                EllipseArc2(ctx, fX, fY, fXRad, fYRad, 0, fAngle2, false);
            }
        }
        else
        {
            if ( fAngle1 >= fAngle2 )
                EllipseArc2(ctx, fX, fY, fXRad, fYRad, fAngle1, fAngle2, true);
            else
            {
                EllipseArc2(ctx, fX, fY, fXRad, fYRad, fAngle1, 0, true);
                EllipseArc2(ctx, fX, fY, fXRad, fYRad, 2 * Math.PI, fAngle2, true);
            }
        }
    }

    function EllipseArc2(ctx, fX, fY, fXRad, fYRad, dAngle1, dAngle2, bClockDirection)
    {
        var nFirstPointQuard  = ((2 * dAngle1 / Math.PI) >> 0) + 1;
        var nSecondPointQuard = ((2 * dAngle2 / Math.PI) >> 0) + 1;
        nSecondPointQuard = Math.min( 4, Math.max( 1, nSecondPointQuard ) );
        nFirstPointQuard  = Math.min( 4, Math.max( 1, nFirstPointQuard ) );

        var fStartX = fX + fXRad * Math.cos( AngToEllPrm( dAngle1, fXRad, fYRad ) );
        var fStartY = fY + fYRad * Math.sin( AngToEllPrm( dAngle1, fXRad, fYRad ) );

        var EndPoint = {X: 0, Y: 0};
        //ctx._l(fStartX, fStartY);

        var fCurX = fStartX, fCurY = fStartY;
        var dStartAngle = dAngle1;
        var dEndAngle = 0;

        if ( !bClockDirection )
        {
            for( var nIndex = nFirstPointQuard; nIndex <= nSecondPointQuard; nIndex++ )
            {
                if ( nIndex == nSecondPointQuard )
                    dEndAngle = dAngle2;
                else
                    dEndAngle = nIndex * Math.PI / 2;
                if ( !( nIndex == nFirstPointQuard ) )
                    dStartAngle = (nIndex - 1 ) * Math.PI / 2;

                EndPoint = EllipseArc3(ctx, fX, fY, fXRad, fYRad, AngToEllPrm( dStartAngle, fXRad, fYRad ), AngToEllPrm( dEndAngle, fXRad, fYRad ), false);
            }
        }
        else
        {
            for( var nIndex = nFirstPointQuard; nIndex >= nSecondPointQuard; nIndex-- )
            {
                if ( nIndex == nFirstPointQuard )
                    dStartAngle = dAngle1;
                else
                    dStartAngle = nIndex * Math.PI / 2;
                if ( !( nIndex == nSecondPointQuard ) )
                    dEndAngle = (nIndex - 1 ) * Math.PI / 2;
                else
                    dEndAngle = dAngle2;

                EndPoint = EllipseArc3(ctx, fX, fY, fXRad, fYRad, AngToEllPrm( dStartAngle, fXRad, fYRad ), AngToEllPrm( dEndAngle, fXRad, fYRad ), false);
            }
        }
    }

    function EllipseArc3(ctx, fX, fY, fXRad, fYRad, dAngle1, dAngle2, bClockDirection)
    {
        var fAlpha = Math.sin( dAngle2 - dAngle1 ) * ( Math.sqrt( 4.0 + 3.0 * Math.tan( (dAngle2 - dAngle1) / 2.0 ) * Math.tan( (dAngle2 - dAngle1) / 2.0 ) ) - 1.0 ) / 3.0;

        var sin1 = Math.sin(dAngle1);
        var cos1 = Math.cos(dAngle1);
        var sin2 = Math.sin(dAngle2);
        var cos2 = Math.cos(dAngle2);

        var fX1 = fX + fXRad * cos1;
        var fY1 = fY + fYRad * sin1;

        var fX2 = fX + fXRad * cos2;
        var fY2 = fY + fYRad * sin2;

        var fCX1 = fX1 - fAlpha * fXRad * sin1;
        var fCY1 = fY1 + fAlpha * fYRad * cos1;

        var fCX2 = fX2 + fAlpha * fXRad * sin2;
        var fCY2 = fY2 - fAlpha * fYRad * cos2;

        if ( !bClockDirection )
        {
            ctx._c(fCX1, fCY1, fCX2, fCY2, fX2, fY2);
            return {X: fX2, Y: fY2};
        }
        else
        {
            ctx._c(fCX2, fCY2, fCX1, fCY1, fX1, fY1);
            return {X: fX1, Y: fY1};
        }
    }

    ArcToCurvers = Arc3;

    // ----------------------------------------------------------------------- //

    function _ArcToOnCanvas(context, start_x, start_y, width_r, height_r, start_ang, sweep_ang)
    {
        var _sin = Math.sin(start_ang);
        var _cos = Math.cos(start_ang);

        var _x = _cos / width_r;
        var _y = _sin / height_r;
        var _l = 1 / Math.sqrt(_x * _x + _y * _y);

        var _cx = start_x - _l * _cos;
        var _cy = start_y - _l * _sin;


        ArcTo2OnCanvas(context, _cx - width_r, _cy - height_r, 2 * width_r, 2 * height_r, start_ang, sweep_ang);
    }

    function ArcTo2OnCanvas(context, _l_c_x, _l_c_y, width,  height, start_ang, sweep_ang)
    {
        if (0 >= width || 0 >= height)
            return;

        start_ang = -start_ang;
        sweep_ang = -sweep_ang;

        var bClockDirection = false;
        var fEndAngle = (2 * Math.PI) - (sweep_ang + start_ang);
        var fSrtAngle = (2 * Math.PI) - start_ang;
        if (sweep_ang > 0)
        {
            bClockDirection = true;
        }

        if (Math.abs(sweep_ang) >= (2 * Math.PI))
        {
            EllipseOnCanvas(context, _l_c_x + width / 2, _l_c_y + height / 2, width / 2, height / 2);
        }
        else
        {
            EllipseArcOnCanvas(context, _l_c_x + width / 2, _l_c_y + height / 2, width / 2, height / 2, fSrtAngle, fEndAngle, bClockDirection);
        }
    }

    function EllipseOnCanvas(ctx, fX, fY, fXRad, fYRad)
    {
        ctx.moveTo(fX - fXRad, fY);
        var c_fKappa = 0.552;
        ctx.bezierCurveTo(fX - fXRad, fY + fYRad * c_fKappa, fX - fXRad * c_fKappa, fY + fYRad, fX, fY + fYRad);
        ctx.bezierCurveTo(fX + fXRad * c_fKappa, fY + fYRad, fX + fXRad, fY + fYRad * c_fKappa, fX + fXRad, fY);
        ctx.bezierCurveTo(fX + fXRad, fY - fYRad * c_fKappa, fX + fXRad * c_fKappa, fY - fYRad, fX, fY - fYRad);
        ctx.bezierCurveTo(fX - fXRad * c_fKappa, fY - fYRad, fX - fXRad, fY - fYRad * c_fKappa, fX - fXRad, fY);
    }


    function EllipseArcOnCanvas(ctx, fX, fY, fXRad, fYRad, fAngle1, fAngle2, bClockDirection)
    {
        while ( fAngle1 < 0 )
            fAngle1 += (2 * Math.PI);

        while ( fAngle1 > (2 * Math.PI) )
            fAngle1 -= (2 * Math.PI);

        while ( fAngle2 < 0 )
            fAngle2 += (2 * Math.PI);

        while ( fAngle2 >= (2 * Math.PI) )
            fAngle2 -= (2 * Math.PI);

        if ( !bClockDirection )
        {
            if ( fAngle1 <= fAngle2 )
                EllipseArc2OnCanvas(ctx, fX, fY, fXRad, fYRad, fAngle1, fAngle2, false);
            else
            {
                EllipseArc2OnCanvas(ctx, fX, fY, fXRad, fYRad, fAngle1, 2 * Math.PI, false);
                EllipseArc2OnCanvas(ctx, fX, fY, fXRad, fYRad, 0, fAngle2, false);
            }
        }
        else
        {
            if ( fAngle1 >= fAngle2 )
                EllipseArc2OnCanvas(ctx, fX, fY, fXRad, fYRad, fAngle1, fAngle2, true);
            else
            {
                EllipseArc2OnCanvas(ctx, fX, fY, fXRad, fYRad, fAngle1, 0, true);
                EllipseArc2OnCanvas(ctx, fX, fY, fXRad, fYRad, 2 * Math.PI, fAngle2, true);
            }
        }
    }


    function EllipseArc2OnCanvas(ctx, fX, fY, fXRad, fYRad, dAngle1, dAngle2, bClockDirection)
    {
        var nFirstPointQuard  = ((2 * dAngle1 / Math.PI) >> 0) + 1;
        var nSecondPointQuard = ((2 * dAngle2 / Math.PI) >> 0) + 1;
        nSecondPointQuard = Math.min( 4, Math.max( 1, nSecondPointQuard ) );
        nFirstPointQuard  = Math.min( 4, Math.max( 1, nFirstPointQuard ) );

        var fStartX = fX + fXRad * Math.cos( AngToEllPrm( dAngle1, fXRad, fYRad ) );
        var fStartY = fY + fYRad * Math.sin( AngToEllPrm( dAngle1, fXRad, fYRad ) );

        var EndPoint = {X: 0, Y: 0};
        ctx.lineTo(fStartX, fStartY);

        var fCurX = fStartX, fCurY = fStartY;
        var dStartAngle = dAngle1;
        var dEndAngle = 0;

        if ( !bClockDirection )
        {
            for( var nIndex = nFirstPointQuard; nIndex <= nSecondPointQuard; nIndex++ )
            {
                if ( nIndex == nSecondPointQuard )
                    dEndAngle = dAngle2;
                else
                    dEndAngle = nIndex * Math.PI / 2;
                if ( !( nIndex == nFirstPointQuard ) )
                    dStartAngle = (nIndex - 1 ) * Math.PI / 2;

                EndPoint = EllipseArc3OnCanvas(ctx, fX, fY, fXRad, fYRad, AngToEllPrm( dStartAngle, fXRad, fYRad ), AngToEllPrm( dEndAngle, fXRad, fYRad ), false);
            }
        }
        else
        {
            for( var nIndex = nFirstPointQuard; nIndex >= nSecondPointQuard; nIndex-- )
            {
                if ( nIndex == nFirstPointQuard )
                    dStartAngle = dAngle1;
                else
                    dStartAngle = nIndex * Math.PI / 2;
                if ( !( nIndex == nSecondPointQuard ) )
                    dEndAngle = (nIndex - 1 ) * Math.PI / 2;
                else
                    dEndAngle = dAngle2;

                EndPoint = EllipseArc3OnCanvas(ctx, fX, fY, fXRad, fYRad, AngToEllPrm( dStartAngle, fXRad, fYRad ), AngToEllPrm( dEndAngle, fXRad, fYRad ), false);
            }
        }
    }

    function EllipseArc3OnCanvas(ctx, fX, fY, fXRad, fYRad, dAngle1, dAngle2, bClockDirection)
    {
        var fAlpha = Math.sin( dAngle2 - dAngle1 ) * ( Math.sqrt( 4.0 + 3.0 * Math.tan( (dAngle2 - dAngle1) / 2.0 ) * Math.tan( (dAngle2 - dAngle1) / 2.0 ) ) - 1.0 ) / 3.0;

        var sin1 = Math.sin(dAngle1);
        var cos1 = Math.cos(dAngle1);
        var sin2 = Math.sin(dAngle2);
        var cos2 = Math.cos(dAngle2);

        var fX1 = fX + fXRad * cos1;
        var fY1 = fY + fYRad * sin1;

        var fX2 = fX + fXRad * cos2;
        var fY2 = fY + fYRad * sin2;

        var fCX1 = fX1 - fAlpha * fXRad * sin1;
        var fCY1 = fY1 + fAlpha * fYRad * cos1;

        var fCX2 = fX2 + fAlpha * fXRad * sin2;
        var fCY2 = fY2 - fAlpha * fYRad * cos2;

        if ( !bClockDirection )
        {
            ctx.bezierCurveTo(fCX1, fCY1, fCX2, fCY2, fX2, fY2);
            return {X: fX2, Y: fY2};
        }
        else
        {
            ctx.bezierCurveTo(fCX2, fCY2, fCX1, fCY1, fX1, fY1);
            return {X: fX1, Y: fY1};
        }
    }

    function _HitToArc(context, px, py,    start_x, start_y, width_r, height_r, start_ang, sweep_ang)
    {
        var _sin = Math.sin(start_ang);
        var _cos = Math.cos(start_ang);

        var _x = _cos / width_r;
        var _y = _sin / height_r;
        var _l = 1 / Math.sqrt(_x * _x + _y * _y);

        var _cx = start_x - _l * _cos;
        var _cy = start_y - _l * _sin;


        return HitToArc2(px, py, context, _cx - width_r, _cy - height_r, 2 * width_r, 2 * height_r, start_ang, sweep_ang);
    }

    function HitToArc2(px, py, context, _l_c_x, _l_c_y, width,  height, start_ang, sweep_ang)
    {
        if (0 >= width || 0 >= height)
            return;

        start_ang = -start_ang;
        sweep_ang = -sweep_ang;

        var bClockDirection = false;
        var fEndAngle = (2 * Math.PI) - (sweep_ang + start_ang);
        var fSrtAngle = (2 * Math.PI) - start_ang;
        if (sweep_ang > 0)
        {
            bClockDirection = true;
        }

        if (Math.abs(sweep_ang) >= (2 * Math.PI))
        {
            return HitToEllipseOnCanvas(px, py, context, _l_c_x + width / 2, _l_c_y + height / 2, width / 2, height / 2);
        }
        else
        {
            return HitToEllipseArcOnCanvas(px, py, context, _l_c_x + width / 2, _l_c_y + height / 2, width / 2, height / 2, fSrtAngle, fEndAngle, bClockDirection);
        }
    }

    function HitToEllipseOnCanvas(px, py, ctx, fX, fY, fXRad, fYRad)
    {
        var c_fKappa = 0.552;
        return HitInBezier4(ctx, px, py, fX - fXRad, fY, fX - fXRad, fY + fYRad * c_fKappa, fX - fXRad * c_fKappa, fY + fYRad, fX, fY + fYRad) ||
            HitInBezier4(ctx, px, py, fX, fY + fYRad, fX + fXRad * c_fKappa, fY + fYRad, fX + fXRad, fY + fYRad * c_fKappa, fX + fXRad, fY)||
            HitInBezier4(ctx, px, py, fX + fXRad, fY, fX + fXRad, fY - fYRad * c_fKappa, fX + fXRad * c_fKappa, fY - fYRad, fX, fY - fYRad)||
            HitInBezier4(ctx, px, py, fX, fY - fYRad, fX - fXRad * c_fKappa, fY - fYRad, fX - fXRad, fY - fYRad * c_fKappa, fX - fXRad, fY);
    }


    function HitToEllipseArcOnCanvas(px, py, ctx, fX, fY, fXRad, fYRad, fAngle1, fAngle2, bClockDirection)
    {
        while ( fAngle1 < 0 )
            fAngle1 += (2 * Math.PI);

        while ( fAngle1 > (2 * Math.PI) )
            fAngle1 -= (2 * Math.PI);

        while ( fAngle2 < 0 )
            fAngle2 += (2 * Math.PI);

        while ( fAngle2 >= (2 * Math.PI) )
            fAngle2 -= (2 * Math.PI);

        if ( !bClockDirection )
        {
            if ( fAngle1 <= fAngle2 )
                return HitToEllipseArc2OnCanvas(px, py,ctx, fX, fY, fXRad, fYRad, fAngle1, fAngle2, false);
            else
            {
                return HitToEllipseArc2OnCanvas(px, py,ctx, fX, fY, fXRad, fYRad, fAngle1, 2 * Math.PI, false)|| HitToEllipseArc2OnCanvas(px, py,ctx, fX, fY, fXRad, fYRad, 0, fAngle2, false);
            }
        }
        else
        {
            if ( fAngle1 >= fAngle2 )
                return HitToEllipseArc2OnCanvas(px, py,ctx, fX, fY, fXRad, fYRad, fAngle1, fAngle2, true);
            else
            {
                return HitToEllipseArc2OnCanvas(px, py, ctx, fX, fY, fXRad, fYRad, fAngle1, 0, true) || HitToEllipseArc2OnCanvas(px, py,ctx, fX, fY, fXRad, fYRad, 2 * Math.PI, fAngle2, true);
            }
        }
    }


    function HitToEllipseArc2OnCanvas(px, py, ctx, fX, fY, fXRad, fYRad, dAngle1, dAngle2, bClockDirection)
    {
        var nFirstPointQuard  = ((2 * dAngle1 / Math.PI) >> 0) + 1;
        var nSecondPointQuard = ((2 * dAngle2 / Math.PI) >> 0) + 1;
        nSecondPointQuard = Math.min( 4, Math.max( 1, nSecondPointQuard ) );
        nFirstPointQuard  = Math.min( 4, Math.max( 1, nFirstPointQuard ) );

        var fStartX = fX + fXRad * Math.cos( AngToEllPrm( dAngle1, fXRad, fYRad ) );
        var fStartY = fY + fYRad * Math.sin( AngToEllPrm( dAngle1, fXRad, fYRad ) );

        var EndPoint = {X: fStartX, Y: fStartY, hit : false};
        var dStartAngle = dAngle1;
        var dEndAngle = 0;

        if ( !bClockDirection )
        {
            for( var nIndex = nFirstPointQuard; nIndex <= nSecondPointQuard; nIndex++ )
            {
                if ( nIndex == nSecondPointQuard )
                    dEndAngle = dAngle2;
                else
                    dEndAngle = nIndex * Math.PI / 2;
                if ( !( nIndex == nFirstPointQuard ) )
                    dStartAngle = (nIndex - 1 ) * Math.PI / 2;


                EndPoint = HitToEllipseArc3OnCanvas(px, py, EndPoint, ctx, fX, fY, fXRad, fYRad, AngToEllPrm( dStartAngle, fXRad, fYRad ), AngToEllPrm( dEndAngle, fXRad, fYRad ), false);
                if(EndPoint.hit)
                {
                    return true;
                }
            }
        }
        else
        {
            for( var nIndex = nFirstPointQuard; nIndex >= nSecondPointQuard; nIndex-- )
            {
                if ( nIndex == nFirstPointQuard )
                    dStartAngle = dAngle1;
                else
                    dStartAngle = nIndex * Math.PI / 2;
                if ( !( nIndex == nSecondPointQuard ) )
                    dEndAngle = (nIndex - 1 ) * Math.PI / 2;
                else
                    dEndAngle = dAngle2;

                EndPoint = HitToEllipseArc3OnCanvas(px, py, EndPoint, ctx, fX, fY, fXRad, fYRad, AngToEllPrm( dStartAngle, fXRad, fYRad ), AngToEllPrm( dEndAngle, fXRad, fYRad ), false);
                if(EndPoint.hit)
                {
                    return true;
                }
            }
        }
        return false;
    }

    function HitToEllipseArc3OnCanvas(px, py, EndPoint, ctx, fX, fY, fXRad, fYRad, dAngle1, dAngle2, bClockDirection)
    {
        var fAlpha = Math.sin( dAngle2 - dAngle1 ) * ( Math.sqrt( 4.0 + 3.0 * Math.tan( (dAngle2 - dAngle1) / 2.0 ) * Math.tan( (dAngle2 - dAngle1) / 2.0 ) ) - 1.0 ) / 3.0;

        var sin1 = Math.sin(dAngle1);
        var cos1 = Math.cos(dAngle1);
        var sin2 = Math.sin(dAngle2);
        var cos2 = Math.cos(dAngle2);

        var fX1 = fX + fXRad * cos1;
        var fY1 = fY + fYRad * sin1;

        var fX2 = fX + fXRad * cos2;
        var fY2 = fY + fYRad * sin2;

        var fCX1 = fX1 - fAlpha * fXRad * sin1;
        var fCY1 = fY1 + fAlpha * fYRad * cos1;

        var fCX2 = fX2 + fAlpha * fXRad * sin2;
        var fCY2 = fY2 - fAlpha * fYRad * cos2;

        if ( !bClockDirection )
        {
            return {X: fX2, Y: fY2, hit :  HitInBezier4(ctx, px, py,EndPoint.X, EndPoint.Y, fCX1, fCY1, fCX2, fCY2, fX2, fY2)};
        }
        else
        {
            return {X: fX1, Y: fY1, hit :  HitInBezier4(ctx, px, py,EndPoint.X, EndPoint.Y, fCX2, fCY2, fCX1, fCY1, fX1, fY1)};
        }
    }

    ArcToOnCanvas = _ArcToOnCanvas;
    HitToArc = _HitToArc;
    // ----------------------------------------------------------------------- //
})();

function getArrayPointsCurveBezierAtArcTo(fX, fY, fWidth, fHeight, fStartAngle, fSweepAngle, lastPointX, lastPointY)
{
    var sin1 = Math.sin(fStartAngle);
    var cos1 = Math.cos(fStartAngle);

    var __x = cos1 / fWidth;
    var __y = sin1 / fHeight;
    var l = 1 / Math.sqrt(__x * __x + __y * __y);

    var cx = fX - l * cos1;
    var cy = fY - l * sin1;

    return getArrayPointsCurveBezierAtArcTo2(cx - fWidth, cy - fHeight, 2 * fWidth, 2 * fHeight, fStartAngle, fSweepAngle, lastPointX, lastPointY);
}

function getArrayPointsCurveBezierAtArcTo2(fX, fY, fWidth, fHeight, fStartAngle, fSweepAngle, lastPointX, lastPointY)
{
    if (0 >= fWidth || 0 >= fHeight)
        return [];

    fStartAngle = -fStartAngle;
    fSweepAngle = -fSweepAngle;


    var bClockDirection = false;
    var fEndAngle = (2 * Math.PI) -(fSweepAngle + fStartAngle);
    var fSrtAngle = (2 * Math.PI) - fStartAngle;
    if( fSweepAngle > 0 )
        bClockDirection = true;

    if(Math.abs(fSweepAngle) >= (2 * Math.PI))
    {
        return getArrayPointsCurveBezierAtArcToEllipse(fX + fWidth / 2, fY + fHeight / 2, fWidth / 2, fHeight / 2);
    }
    else
    {
        return getArrayPointsCurveBezierAtArcToEllipseArc(fX + fWidth / 2, fY + fHeight / 2, fWidth / 2, fHeight / 2, fSrtAngle, fEndAngle, bClockDirection, lastPointX, lastPointY);
    }
}

function getArrayPointsCurveBezierAtArcToEllipse(fX, fY, fXRad, fYRad)
{
    var c_fKappa = 0.552;
    var ret_arr = [];

    ret_arr.push(
        {
            x0: fX - fXRad,
            y0: fY,

            x1: fX - fXRad,
            y1: fY + fYRad * c_fKappa,

            x2: fX - fXRad * c_fKappa,
            y2: fY + fYRad,

            x3: fX,
            y3: fY + fYRad
        }
    );

    ret_arr.push(
        {
            x0: fX,
            y0: fY + fYRad,

            x1: fX + fXRad * c_fKappa,
            y1: fY + fYRad,

            x2: fX + fXRad,
            y2: fY + fYRad * c_fKappa,

            x3: fX + fXRad,
            y3: fY
        }
    );

    ret_arr.push(
        {
            x0: fX + fXRad,
            y0: fY,

            x1: fX + fXRad,
            y1: fY - fYRad * c_fKappa,

            x2: fX + fXRad * c_fKappa,
            y2: fY - fYRad,

            x3: fX,
            y3: fY - fYRad
        }
    );

    ret_arr.push(
        {
            x0: fX + fXRad,
            y0: fY,

            x1: fX + fXRad,
            y1: fY - fYRad * c_fKappa,

            x2: fX + fXRad * c_fKappa,
            y2: fY - fYRad,

            x3: fX,
            y3: fY - fYRad
        }
    );

    ret_arr.push(
        {
            x0: fX,
            y0: fY - fYRad,


            x1: fX - fXRad * c_fKappa,
            y1: fY - fYRad,

            x2: fX - fXRad,
            y2: fY - fYRad * c_fKappa,

            x3: fX - fXRad,
            y3: fY
        }
    );
    return ret_arr;
}

function getArrayPointsCurveBezierAtArcToEllipseArc(fX, fY, fXRad, fYRad, fAngle1, fAngle2, bClockDirection, lastPointX, lastPointY)
{
    while ( fAngle1 < 0 )
        fAngle1 += (2 * Math.PI);

    while ( fAngle1 > (2 * Math.PI) )
        fAngle1 -= (2 * Math.PI);

    while ( fAngle2 < 0 )
        fAngle2 += (2 * Math.PI);

    while ( fAngle2 >= (2 * Math.PI) )
        fAngle2 -= (2 * Math.PI);

    if ( !bClockDirection )
    {
        if ( fAngle1 <= fAngle2 )
            return getArrayPointsCurveBezierAtArcToEllipseArc2(fX, fY, fXRad, fYRad, fAngle1, fAngle2, false, lastPointX, lastPointY);
        else
        {
            var tmp = getArrayPointsCurveBezierAtArcToEllipseArc2(fX, fY, fXRad, fYRad, fAngle1, 2 * Math.PI, false, lastPointX, lastPointY);
            return tmp.concat(getArrayPointsCurveBezierAtArcToEllipseArc2(fX, fY, fXRad, fYRad, 0, fAngle2, false, tmp.x4, tmp.y4));
        }
    }
    else
    {
        if ( fAngle1 >= fAngle2 )
            return getArrayPointsCurveBezierAtArcToEllipseArc2(fX, fY, fXRad, fYRad, fAngle1, fAngle2, true, lastPointX, lastPointY);
        else
        {
            tmp = getArrayPointsCurveBezierAtArcToEllipseArc2(fX, fY, fXRad, fYRad, fAngle1, 0, true, lastPointX, lastPointY);
            return tmp.concat(getArrayPointsCurveBezierAtArcToEllipseArc2(fX, fY, fXRad, fYRad, 2 * Math.PI, fAngle2, true, tmp.x4, tmp.y4));
        }
    }
}

function getArrayPointsCurveBezierAtArcToEllipseArc2( fX, fY, fXRad, fYRad, dAngle1, dAngle2, bClockDirection, lastPointX, lastPointY)
{
    var nFirstPointQuard  = ((2 * dAngle1 / Math.PI) >> 0) + 1;
    var nSecondPointQuard = ((2 * dAngle2 / Math.PI) >> 0) + 1;
    nSecondPointQuard = Math.min( 4, Math.max( 1, nSecondPointQuard ) );
    nFirstPointQuard  = Math.min( 4, Math.max( 1, nFirstPointQuard ) );

    var fStartX = fX + fXRad * Math.cos( AngToEllPrm( dAngle1, fXRad, fYRad ) );
    var fStartY = fY + fYRad * Math.sin( AngToEllPrm( dAngle1, fXRad, fYRad ) );

    var EndPoint = {X: 0, Y: 0};
    //ctx._l(fStartX, fStartY);

    var fCurX = fStartX, fCurY = fStartY;
    var dStartAngle = dAngle1;
    var dEndAngle = 0;

    if ( !bClockDirection )
    {
        for( var nIndex = nFirstPointQuard; nIndex <= nSecondPointQuard; nIndex++ )
        {
            if ( nIndex == nSecondPointQuard )
                dEndAngle = dAngle2;
            else
                dEndAngle = nIndex * Math.PI / 2;
            if ( !( nIndex == nFirstPointQuard ) )
                dStartAngle = (nIndex - 1 ) * Math.PI / 2;

            return getArrayPointsCurveBezierAtArcToEllipseArc3(fX, fY, fXRad, fYRad, AngToEllPrm( dStartAngle, fXRad, fYRad ), AngToEllPrm( dEndAngle, fXRad, fYRad ), false, lastPointX, lastPointY);
        }
    }
    else
    {
        for( var nIndex = nFirstPointQuard; nIndex >= nSecondPointQuard; nIndex-- )
        {
            if ( nIndex == nFirstPointQuard )
                dStartAngle = dAngle1;
            else
                dStartAngle = nIndex * Math.PI / 2;
            if ( !( nIndex == nSecondPointQuard ) )
                dEndAngle = (nIndex - 1 ) * Math.PI / 2;
            else
                dEndAngle = dAngle2;

            return getArrayPointsCurveBezierAtArcToEllipseArc3(fX, fY, fXRad, fYRad, AngToEllPrm( dStartAngle, fXRad, fYRad ), AngToEllPrm( dEndAngle, fXRad, fYRad ), false, lastPointX, lastPointY);
        }
    }
}

function getArrayPointsCurveBezierAtArcToEllipseArc3(fX, fY, fXRad, fYRad, dAngle1, dAngle2, bClockDirection, lastPointX, lastPointY)
{
    var fAlpha = Math.sin( dAngle2 - dAngle1 ) * ( Math.sqrt( 4.0 + 3.0 * Math.tan( (dAngle2 - dAngle1) / 2.0 ) * Math.tan( (dAngle2 - dAngle1) / 2.0 ) ) - 1.0 ) / 3.0;

    var sin1 = Math.sin(dAngle1);
    var cos1 = Math.cos(dAngle1);
    var sin2 = Math.sin(dAngle2);
    var cos2 = Math.cos(dAngle2);

    var fX1 = fX + fXRad * cos1;
    var fY1 = fY + fYRad * sin1;

    var fX2 = fX + fXRad * cos2;
    var fY2 = fY + fYRad * sin2;

    var fCX1 = fX1 - fAlpha * fXRad * sin1;
    var fCY1 = fY1 + fAlpha * fYRad * cos1;

    var fCX2 = fX2 + fAlpha * fXRad * sin2;
    var fCY2 = fY2 - fAlpha * fYRad * cos2;

    if ( !bClockDirection )
    {
        return [{x0: lastPointX, y0:lastPointY, x1:fCX1, y1: fCY1, x2:fCX2, y2: fCY2, x3:fX2, y3: fY2}];
    }
    else
    {
        return [{x0: lastPointX, y0:lastPointY, x1:fCX2, y1: fCY2, x2:fCX1, y2: fCY1, x3:fX1, y3: fY1}];
    }
}
